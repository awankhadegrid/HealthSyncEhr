import { useEffect, useState } from 'react';
import PharmacyPanelLayout from '../../components/pharmacy/PharmacyPanelLayout.jsx';
import {
  createDosageMaster,
  createDurationMaster,
  createFrequencyMaster,
  createMedicineMaster,
  getPrescriptionMasterData,
} from '../../services/pharmacyMasterService.js';

const MEDICINE_TYPE_OPTIONS = [
  'TABLET',
  'CAPSULE',
  'SYRUP',
  'DROPS',
  'INJECTION',
  'CREAM',
  'OINTMENT',
  'GEL',
  'INHALER',
  'SPRAY',
  'POWDER',
];

const FALLBACK_DATA = {
  medicines: [
    {
      medicineId: 1,
      drugName: 'Paracetamol',
      brandName: 'Dolo',
      medicine_type: 'TABLET',
      pricePerQuantity: 12,
      verified: true,
    },
    {
      medicineId: 2,
      drugName: 'Cetirizine',
      brandName: 'Cetzine',
      medicine_type: 'TABLET',
      pricePerQuantity: 18,
      verified: true,
    },
  ],
  dosages: [
    { dosageId: 1, dosageValue: '250 mg', verified: true },
    { dosageId: 2, dosageValue: '500 mg', verified: true },
  ],
  frequencies: [
    { frequencyId: 1, frequency: 'Once daily', verified: true },
    { frequencyId: 2, frequency: 'Twice daily', verified: true },
  ],
  durations: [
    { durationId: 1, duration: '3 days', verified: true },
    { durationId: 2, duration: '5 days', verified: true },
  ],
};

const INITIAL_MEDICINE_FORM = {
  drugName: '',
  brandName: '',
  medicineType: '',
  pricePerQuantity: '',
};

const INITIAL_OPTION_FORM = {
  value: '',
};

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  return [];
}

function PharmacyMedicineMasterPage() {
  const storedUser = JSON.parse(localStorage.getItem('userData') || 'null');
  const userName = storedUser?.name || 'Pharmacy User';
  const [masterData, setMasterData] = useState(FALLBACK_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState('');
  const [medicineForm, setMedicineForm] = useState(INITIAL_MEDICINE_FORM);
  const [dosageForm, setDosageForm] = useState(INITIAL_OPTION_FORM);
  const [frequencyForm, setFrequencyForm] = useState(INITIAL_OPTION_FORM);
  const [durationForm, setDurationForm] = useState(INITIAL_OPTION_FORM);

  useEffect(() => {
    let isMounted = true;

    async function loadMasterData() {
      setIsLoading(true);

      try {
        const response = await getPrescriptionMasterData();

        if (!isMounted) {
          return;
        }

        setMasterData({
          medicines: normalizeList(response?.medicines).length
            ? normalizeList(response?.medicines)
            : FALLBACK_DATA.medicines,
          dosages: normalizeList(response?.dosages).length
            ? normalizeList(response?.dosages)
            : FALLBACK_DATA.dosages,
          frequencies: normalizeList(response?.frequencies).length
            ? normalizeList(response?.frequencies)
            : FALLBACK_DATA.frequencies,
          durations: normalizeList(response?.durations).length
            ? normalizeList(response?.durations)
            : FALLBACK_DATA.durations,
        });
        setPageError('');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setMasterData(FALLBACK_DATA);
        setPageError(
          error.response?.data?.message ||
            'Unable to load medicine master data. Showing local preview.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMasterData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMedicineChange = (event) => {
    const { name, value } = event.target;
    setMedicineForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSimpleFormChange = (setter) => (event) => {
    setter({ value: event.target.value });
  };

  const handleCreateMedicine = async (event) => {
    event.preventDefault();

    const payload = {
      drugName: medicineForm.drugName,
      brandName: medicineForm.brandName,
      medicine_type: medicineForm.medicineType,
      pricePerQuantity: Number(medicineForm.pricePerQuantity),
    };

    try {
      const response = await createMedicineMaster(payload);
      const createdItem = {
        medicineId: response?.medicineId || Date.now(),
        drugName: response?.drugName || response?.drungName || payload.drugName,
        brandName: response?.brandName || payload.brandName,
        medicine_type: response?.medicine_type || response?.medicineType || payload.medicineType,
        pricePerQuantity:
          response?.pricePerQuantity ?? payload.pricePerQuantity,
        verified: response?.verified ?? false,
      };

      setMasterData((currentData) => ({
        ...currentData,
        medicines: [createdItem, ...currentData.medicines],
      }));
      setMedicineForm(INITIAL_MEDICINE_FORM);
      setPageError('');
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          'Unable to create medicine. Check backend API.'
      );
    }
  };

  const handleCreateOption = async (event, type) => {
    event.preventDefault();

    const config = {
      dosages: {
        form: dosageForm,
        setter: setDosageForm,
        create: createDosageMaster,
        idKey: 'dosageId',
        valueKey: 'dosageValue',
      },
      frequencies: {
        form: frequencyForm,
        setter: setFrequencyForm,
        create: createFrequencyMaster,
        idKey: 'frequencyId',
        valueKey: 'frequency',
      },
      durations: {
        form: durationForm,
        setter: setDurationForm,
        create: createDurationMaster,
        idKey: 'durationId',
        valueKey: 'duration',
      },
    }[type];

    const payload = { [config.valueKey]: config.form.value };

    try {
      const response = await config.create(payload);
      const createdItem = {
        [config.idKey]: response?.[config.idKey] || Date.now(),
        [config.valueKey]: response?.[config.valueKey] || config.form.value,
        verified: response?.verified ?? false,
      };

      setMasterData((currentData) => ({
        ...currentData,
        [type]: [createdItem, ...currentData[type]],
      }));
      config.setter(INITIAL_OPTION_FORM);
      setPageError('');
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          `Unable to create ${type.slice(0, -1)}. Check backend API.`
      );
    }
  };

  return (
    <PharmacyPanelLayout heading="Medicine Master" userName={userName}>
      {pageError ? <p className="form-error">{pageError}</p> : null}

      <section className="panel-card panel-card--wide pharmacy-master-card">
        <div className="panel-section__header">
          <h3>Medicine Registry</h3>
          <span>{isLoading ? 'Syncing...' : 'Backend ready'}</span>
        </div>

        <div className="pharmacy-master-layout">
          <form className="pharmacy-master-form" onSubmit={handleCreateMedicine}>
            <label className="input-group" htmlFor="drugName">
              <span>Medicine Name</span>
              <input
                id="drugName"
                name="drugName"
                value={medicineForm.drugName}
                onChange={handleMedicineChange}
                placeholder="Enter medicine name"
              />
            </label>

            <label className="input-group" htmlFor="brandName">
              <span>Brand Name</span>
              <input
                id="brandName"
                name="brandName"
                value={medicineForm.brandName}
                onChange={handleMedicineChange}
                placeholder="Enter brand name"
              />
            </label>

            <label className="input-group" htmlFor="medicineType">
              <span>Type</span>
              <select
                id="medicineType"
                name="medicineType"
                value={medicineForm.medicineType}
                onChange={handleMedicineChange}
              >
                <option value="">Select type</option>
                {MEDICINE_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="input-group" htmlFor="pricePerQuantity">
              <span>Price Per Quantity</span>
              <input
                id="pricePerQuantity"
                name="pricePerQuantity"
                type="number"
                min="0"
                value={medicineForm.pricePerQuantity}
                onChange={handleMedicineChange}
                placeholder="Enter amount"
              />
            </label>

            <button className="panel-action-button pharmacy-master-button" type="submit">
              Add medicine
            </button>
          </form>

          <section className="panel-card pharmacy-master-select-card">
            <div className="panel-section__header">
              <h3>Current Medicine List</h3>
              <span>{masterData.medicines.length} options</span>
            </div>

            <div className="pharmacy-master-list-window">
              {masterData.medicines.map((item) => (
                <div key={item.medicineId} className="pharmacy-master-list-window__item">
                  <strong>{item.drugName || item.drungName || item.medicineName}</strong>
                  <span>{item.brandName}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="pharmacy-master-option-grid">
        {[
          {
            key: 'dosages',
            title: 'Dosage Master',
            list: masterData.dosages,
            form: dosageForm,
            placeholder: 'Enter dosage value',
            label: 'Dosage Value',
            valueKey: 'dosageValue',
            idKey: 'dosageId',
          },
          {
            key: 'frequencies',
            title: 'Frequency Master',
            list: masterData.frequencies,
            form: frequencyForm,
            placeholder: 'Enter frequency',
            label: 'Frequency Value',
            valueKey: 'frequency',
            idKey: 'frequencyId',
          },
          {
            key: 'durations',
            title: 'Duration Master',
            list: masterData.durations,
            form: durationForm,
            placeholder: 'Enter duration',
            label: 'Duration Value',
            valueKey: 'duration',
            idKey: 'durationId',
          },
        ].map((section) => (
          <section key={section.key} className="panel-card pharmacy-master-option-card">
            <div className="panel-section__header">
              <h3>{section.title}</h3>
              <span>{section.list.length} items</span>
            </div>

            <form
              className="pharmacy-master-simple-form"
              onSubmit={(event) => handleCreateOption(event, section.key)}
            >
              <label className="input-group" htmlFor={section.key}>
                <span>{section.label}</span>
                <input
                  id={section.key}
                  value={section.form.value}
                  onChange={handleSimpleFormChange(
                    section.key === 'dosages'
                      ? setDosageForm
                      : section.key === 'frequencies'
                        ? setFrequencyForm
                        : setDurationForm
                  )}
                  placeholder={section.placeholder}
                />
              </label>

              <button className="panel-action-button pharmacy-master-button" type="submit">
                Add
              </button>
            </form>

            <section className="panel-card pharmacy-master-select-card">
              <div className="panel-section__header">
                <h3>{section.title} List</h3>
                <span>{section.list.length} options</span>
              </div>

              <div className="pharmacy-master-list-window">
                {section.list.map((item) => (
                  <div
                    key={item[section.idKey]}
                    className="pharmacy-master-list-window__item"
                  >
                    <strong>{item[section.valueKey]}</strong>
                  </div>
                ))}
              </div>
            </section>

          </section>
        ))}
      </section>
    </PharmacyPanelLayout>
  );
}

export default PharmacyMedicineMasterPage;
