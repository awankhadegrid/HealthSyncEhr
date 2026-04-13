import { useState, useEffect } from 'react';
import { getAllLaboratoryTests } from '../../services/laboratoryMasterService.js';

const SAMPLE_TYPE_OPTIONS = [
  { id: 'BLOOD', label: 'Blood' },
  { id: 'URINE', label: 'Urine' },
];

function DoctorLabTestPrescriptionForm({ patientId, onAddTest }) {
  const [labTests, setLabTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [selectedTestId, setSelectedTestId] = useState('');
  const [selectedSampleType, setSelectedSampleType] = useState('');
  const [addError, setAddError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadLabTests() {
      setIsLoading(true);
      setLoadError('');

      try {
        const response = await getAllLaboratoryTests();
        
        if (!isMounted) {
          return;
        }

        setLabTests(Array.isArray(response) ? response : response?.data || []);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setLoadError(
          error.response?.data?.message ||
            'Unable to load lab tests. Check backend API.'
        );
        setLabTests([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadLabTests();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddLabTest = (event) => {
    event.preventDefault();
    setAddError('');

    if (!selectedTestId || !selectedSampleType) {
      setAddError('Select both test and sample type before adding.');
      return;
    }

    const selectedTest = labTests.find((test) => test.labTestId === Number(selectedTestId));

    if (selectedTest && onAddTest) {
      onAddTest({
        id: Date.now(),
        labTestId: selectedTest.labTestId,
        testName: selectedTest.testName,
        testCode: selectedTest.testCode,
        sampleType: selectedSampleType,
        parameters: selectedTest.parameters || [],
      });

      setSelectedTestId('');
      setSelectedSampleType('');
    }
  };

  return (
    <form className="doctor-lab-test-form" onSubmit={handleAddLabTest}>
      {isLoading && <p className="form-info">Loading lab tests...</p>}
      {loadError && <p className="form-error">{loadError}</p>}
      {addError && <p className="form-error">{addError}</p>}

      <div className="doctor-lab-test-form__fields">
        <label className="input-group" htmlFor="labTest">
          <span>Select Lab Test</span>
          <select
            id="labTest"
            value={selectedTestId}
            onChange={(e) => setSelectedTestId(e.target.value)}
            disabled={isLoading || labTests.length === 0}
          >
            <option value="">Choose a test</option>
            {labTests.map((test) => (
              <option key={test.labTestId} value={test.labTestId}>
                {test.testName} ({test.testCode})
              </option>
            ))}
          </select>
        </label>

        <label className="input-group" htmlFor="sampleType">
          <span>Sample Type</span>
          <select
            id="sampleType"
            value={selectedSampleType}
            onChange={(e) => setSelectedSampleType(e.target.value)}
          >
            <option value="">Select sample type</option>
            {SAMPLE_TYPE_OPTIONS.map((option) => (
              <option key={option.id} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="doctor-lab-test-form__actions">
        <button
          className="panel-action-button doctor-add-lab-test-button"
          type="submit"
          disabled={isLoading}
        >
          Add Lab Test
        </button>
      </div>
    </form>
  );
}

export default DoctorLabTestPrescriptionForm;
