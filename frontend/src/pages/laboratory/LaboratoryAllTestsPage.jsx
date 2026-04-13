import { useEffect, useMemo, useState } from 'react';
import LaboratoryPanelLayout from '../../components/laboratory/LaboratoryPanelLayout.jsx';
import { getAllLaboratoryTests } from '../../services/laboratoryMasterService.js';

const FALLBACK_TESTS = [
  {
    labTestId: 1,
    testName: 'Complete Blood Count',
    testCode: 'CBC',
    sampleType: 'Blood',
    description: 'Basic blood investigation',
    parameters: [
      { parameterId: 1, parameterName: 'Hemoglobin', unit: 'g/dL', valueType: 'NUMBER' },
      { parameterId: 2, parameterName: 'WBC', unit: '/uL', valueType: 'NUMBER' },
    ],
  },
  {
    labTestId: 2,
    testName: 'Urine Routine',
    testCode: 'URT',
    sampleType: 'Urine',
    description: 'Routine urine examination',
    parameters: [
      { parameterId: 3, parameterName: 'Color', unit: '', valueType: 'TEXT' },
      { parameterId: 4, parameterName: 'Protein', unit: '', valueType: 'TEXT' },
    ],
  },
];

function normalizeTests(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.tests)) {
    return payload.tests;
  }

  return [];
}

function LaboratoryAllTestsPage() {
  const storedUser = JSON.parse(localStorage.getItem('userData') || 'null');
  const userName = storedUser?.name || 'Laboratory User';
  const [tests, setTests] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadTests() {
      setIsLoading(true);

      try {
        const response = await getAllLaboratoryTests();

        if (!isMounted) {
          return;
        }

        const normalizedTests = normalizeTests(response);
        setTests(normalizedTests.length ? normalizedTests : FALLBACK_TESTS);
        setPageError('');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setTests(FALLBACK_TESTS);
        setPageError(
          error.response?.data?.message ||
            'Unable to load lab tests. Showing preview data.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTests();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTests = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return tests;
    }

    return tests.filter((item) =>
      [item.testName, item.testCode, item.sampleType, item.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [tests, searchValue]);

  const formatParameterSummary = (parameters) => {
    if (!Array.isArray(parameters) || parameters.length === 0) {
      return 'No parameters added';
    }

    return parameters
      .map((parameter) => {
        const name = parameter.parameterName || 'Unnamed';
        const unit = parameter.unit ? ` (${parameter.unit})` : '';
        return `${name}${unit}`;
      })
      .join(', ');
  };

  return (
    <LaboratoryPanelLayout heading="All Lab Tests" userName={userName}>
      {pageError ? <p className="form-error">{pageError}</p> : null}

      <section className="panel-card panel-card--wide laboratory-tests-card">
        <div className="panel-section__header">
          <h3>Saved Test Templates</h3>
          <span>{isLoading ? 'Loading...' : `${filteredTests.length} tests`}</span>
        </div>

        <div className="laboratory-tests-toolbar">
          <label className="input-group laboratory-tests-search" htmlFor="laboratory-tests-search">
            <span>Search Test</span>
            <input
              id="laboratory-tests-search"
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by test name, code, sample or description"
            />
          </label>
        </div>

        <div className="laboratory-tests-table">
          {isLoading ? (
            <div className="laboratory-orders-table__empty">Loading lab tests...</div>
          ) : filteredTests.length === 0 ? (
            <div className="laboratory-orders-table__empty">No lab tests available.</div>
          ) : (
            <>
              <div className="laboratory-tests-table__head">
                <span>Test Name</span>
                <span>Code</span>
                <span>Sample Type</span>
                <span>Description</span>
                <span>Parameters</span>
                <span>Count</span>
              </div>

              {filteredTests.map((item) => (
                <div
                  key={item.labTestId || item.testCode || item.testName}
                  className="laboratory-tests-table__row"
                >
                  <span>{item.testName || 'Untitled Test'}</span>
                  <span>{item.testCode || 'No code'}</span>
                  <span>{item.sampleType || 'Not added'}</span>
                  <span>{item.description || 'No description added'}</span>
                  <span>{formatParameterSummary(item.parameters)}</span>
                  <span>{item.parameters?.length || 0}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </LaboratoryPanelLayout>
  );
}

export default LaboratoryAllTestsPage;
