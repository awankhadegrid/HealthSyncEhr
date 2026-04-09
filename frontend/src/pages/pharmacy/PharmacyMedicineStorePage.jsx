import { useEffect, useMemo, useState } from 'react';
import PharmacyPanelLayout from '../../components/pharmacy/PharmacyPanelLayout.jsx';
import {
  addMedicineStoreItemToMaster,
  getMedicineStoreItems,
  scheduleMedicineStoreSync,
} from '../../services/medicineStoreService.js';

const FALLBACK_MEDICINES = [
  {
    id: 1,
    drugName: 'Paracetamol',
    genericName: 'Acetaminophen',
    brandName: 'Dolo 650',
    medicineType: 'TABLET',
  },
  {
    id: 2,
    drugName: 'Cetirizine Hydrochloride',
    genericName: 'Cetirizine',
    brandName: 'Cetzine',
    medicineType: 'TABLET',
  },
  {
    id: 3,
    drugName: 'Amoxicillin and Potassium Clavulanate Oral Suspension',
    genericName: 'Amoxicillin + Clavulanate',
    brandName: 'Augmentin',
    medicineType: 'SYRUP',
  },
];

function normalizeList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.medicines)) {
    return payload.medicines;
  }

  return [];
}

function PharmacyMedicineStorePage() {
  const storedUser = JSON.parse(localStorage.getItem('userData') || 'null');
  const userName = storedUser?.name || 'Pharmacy User';
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [syncTime, setSyncTime] = useState('09:00');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [pricePerQuantity, setPricePerQuantity] = useState('');
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadMedicineStoreItems() {
      setIsLoading(true);

      try {
        const response = await getMedicineStoreItems();

        if (!isMounted) {
          return;
        }

        const normalizedItems = normalizeList(response);
        setMedicines(normalizedItems.length ? normalizedItems : FALLBACK_MEDICINES);
        setPageError('');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setMedicines(FALLBACK_MEDICINES);
        setPageError(
          error.response?.data?.message ||
            'Unable to load medicine store. Showing preview data.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMedicineStoreItems();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMedicines = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();

    if (!normalizedQuery) {
      return medicines;
    }

    return medicines.filter((item) =>
      [item.drugName, item.genericName, item.brandName, item.medicineType]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery))
    );
  }, [medicines, searchValue]);

  const handleScheduleSync = async () => {
    if (!syncTime) {
      setPageError('Select a daily time before scheduling the medicine API.');
      return;
    }

    setIsScheduling(true);
    setScheduleMessage('');
    setPageError('');

    try {
      const response = await scheduleMedicineStoreSync({ time: syncTime });
      setScheduleMessage(
        response?.message || `Medicine sync scheduled daily at ${syncTime}.`
      );
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          'Unable to schedule medicine API sync. Check backend API.'
      );
    } finally {
      setIsScheduling(false);
    }
  };

  const handleOpenAddModal = (medicine) => {
    setSelectedMedicine(medicine);
    setPricePerQuantity('');
    setModalError('');
  };

  const handleCloseAddModal = () => {
    setSelectedMedicine(null);
    setPricePerQuantity('');
    setModalError('');
  };

  const handleAddToMedicineMaster = async () => {
    if (!selectedMedicine) {
      return;
    }

    if (!pricePerQuantity || Number(pricePerQuantity) <= 0) {
      setModalError('Enter a valid price per quantity before saving.');
      return;
    }

    setIsAddingMedicine(true);
    setModalError('');
    setPageError('');

    try {
      await addMedicineStoreItemToMaster(selectedMedicine.id, {
        pricePerQuantity: Number(pricePerQuantity),
      });

      setScheduleMessage(
        `${selectedMedicine.drugName} was added to the medicine master successfully.`
      );
      handleCloseAddModal();
    } catch (error) {
      setModalError(
        error.response?.data?.message ||
          'Unable to add medicine to master. Check backend API.'
      );
    } finally {
      setIsAddingMedicine(false);
    }
  };

  return (
    <PharmacyPanelLayout heading="Medicine Store" userName={userName}>
      {pageError ? <p className="form-error">{pageError}</p> : null}

      <section className="panel-card panel-card--wide medicine-store-card">
        <div className="panel-section__header medicine-store-card__header">
          <div>
            <h3>Medicine Inventory</h3>
            <p className="panel-section__copy">
              Review all medicines available in the medicine store. Long names wrap
              inside the table so the layout stays clean.
            </p>
          </div>
          <span>{isLoading ? 'Loading...' : `${filteredMedicines.length} medicines`}</span>
        </div>

        <div className="medicine-store-toolbar">
          <label className="input-group medicine-store-search" htmlFor="medicine-store-search">
            <span>Search Medicine</span>
            <input
              id="medicine-store-search"
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by drug, generic, brand or type"
            />
          </label>

          <div className="medicine-store-scheduler">
            <label className="input-group medicine-store-time" htmlFor="medicine-store-time">
              <span>Daily API Time</span>
              <input
                id="medicine-store-time"
                type="time"
                value={syncTime}
                onChange={(event) => setSyncTime(event.target.value)}
              />
            </label>

            <button
              className="panel-action-button pharmacy-master-button medicine-store-scheduler__button"
              type="button"
              onClick={handleScheduleSync}
              disabled={isScheduling}
            >
              {isScheduling ? 'Saving...' : 'Set Time'}
            </button>
          </div>
        </div>

        {scheduleMessage ? (
          <p className="medicine-store-scheduler__message">{scheduleMessage}</p>
        ) : null}

        <div className="medicine-store-table">
          <div className="medicine-store-table__head">
            <span>Drug Name</span>
            <span>Generic Name</span>
            <span>Brand Name</span>
            <span>Type</span>
            <span>Action</span>
          </div>

          {isLoading ? (
            <div className="medicine-store-table__empty">Loading medicine store...</div>
          ) : filteredMedicines.length === 0 ? (
            <div className="medicine-store-table__empty">No medicines found for this search.</div>
          ) : (
            filteredMedicines.map((item) => (
              <div
                key={item.id || `${item.drugName}-${item.brandName}`}
                className="medicine-store-table__row"
              >
                <span>{item.drugName || 'Not added'}</span>
                <span>{item.genericName || 'Not added'}</span>
                <span>{item.brandName || 'Not added'}</span>
                <span>{item.medicineType || 'Not added'}</span>
                <span className="medicine-store-table__action">
                  <button
                    className="panel-action-button pharmacy-master-button medicine-store-add-button"
                    type="button"
                    onClick={() => handleOpenAddModal(item)}
                  >
                    Add to Medicines
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {selectedMedicine ? (
        <div className="modal-overlay" role="presentation">
          <div
            className="patient-modal medicine-store-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="medicine-store-modal-title"
          >
            <div className="patient-modal__header">
              <div>
                <p className="patient-modal__eyebrow">Medicine Transfer</p>
                <h3 id="medicine-store-modal-title">Add Medicine To Master</h3>
              </div>
              <button
                className="patient-modal__close"
                type="button"
                onClick={handleCloseAddModal}
              >
                Close
              </button>
            </div>

            <div className="patient-modal__body">
              <section className="medicine-store-modal__details">
                <div className="medicine-store-modal__item">
                  <span>Drug Name</span>
                  <strong>{selectedMedicine.drugName || 'Not added'}</strong>
                </div>
                <div className="medicine-store-modal__item">
                  <span>Generic Name</span>
                  <strong>{selectedMedicine.genericName || 'Not added'}</strong>
                </div>
                <div className="medicine-store-modal__item">
                  <span>Brand Name</span>
                  <strong>{selectedMedicine.brandName || 'Not added'}</strong>
                </div>
                <div className="medicine-store-modal__item">
                  <span>Store Type</span>
                  <strong>{selectedMedicine.medicineType || 'Not added'}</strong>
                </div>
              </section>

              <label className="input-group medicine-store-modal__price" htmlFor="pricePerQuantity">
                <span>Price Per Quantity</span>
                <input
                  id="pricePerQuantity"
                  type="number"
                  min="1"
                  value={pricePerQuantity}
                  onChange={(event) => setPricePerQuantity(event.target.value)}
                  placeholder="Enter price"
                />
              </label>

              {modalError ? <p className="form-error">{modalError}</p> : null}

              <div className="medicine-store-modal__actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={handleCloseAddModal}
                >
                  Cancel
                </button>
                <button
                  className="panel-action-button pharmacy-master-button"
                  type="button"
                  onClick={handleAddToMedicineMaster}
                  disabled={isAddingMedicine}
                >
                  {isAddingMedicine ? 'Saving...' : 'Add Medicine'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </PharmacyPanelLayout>
  );
}

export default PharmacyMedicineStorePage;
