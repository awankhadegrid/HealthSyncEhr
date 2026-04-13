import { useState } from 'react';
import LaboratoryPanelLayout from '../../components/laboratory/LaboratoryPanelLayout.jsx';
import { createLaboratoryTest } from '../../services/laboratoryMasterService.js';

const VALUE_TYPE_OPTIONS = ['NUMBER', 'TEXT', 'BOOLEAN'];

const SAMPLE_TYPE_OPTIONS = [
  { id: 'BLOOD', label: 'Blood' },
  { id: 'URINE', label: 'Urine' },
];

const INITIAL_TEST_FORM = {
  testName: '',
  testCode: '',
  sampleType: '',
  description: '',
};

const INITIAL_PARAMETER = {
  parameterName: '',
  unit: '',
  minValue: '',
  maxValue: '',
  normalText: '',
  displayOrder: '',
  valueType: 'NUMBER',
};

function LaboratoryAddTestPage() {
  const storedUser = JSON.parse(localStorage.getItem('userData') || 'null');
  const userName = storedUser?.name || 'Laboratory User';
  const [testForm, setTestForm] = useState(INITIAL_TEST_FORM);
  const [parameters, setParameters] = useState([{ ...INITIAL_PARAMETER, id: Date.now() }]);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleTestFormChange = (event) => {
    const { name, value } = event.target;
    setTestForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleParameterChange = (id, field, value) => {
    setParameters((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleAddParameter = () => {
    setParameters((current) => [
      ...current,
      { ...INITIAL_PARAMETER, id: Date.now() + current.length },
    ]);
  };

  const handleRemoveParameter = (id) => {
    setParameters((current) =>
      current.length === 1 ? current : current.filter((item) => item.id !== id)
    );
  };

  const buildPayload = () => ({
    testName: testForm.testName.trim(),
    testCode: testForm.testCode.trim(),
    sampleType: testForm.sampleType.trim(),
    description: testForm.description.trim(),
    parameters: parameters.map((item, index) => ({
      parameterName: item.parameterName.trim(),
      unit: item.unit.trim(),
      minValue: item.minValue === '' ? null : Number(item.minValue),
      maxValue: item.maxValue === '' ? null : Number(item.maxValue),
      normalText: item.normalText.trim(),
      displayOrder:
        item.displayOrder === '' ? index + 1 : Number(item.displayOrder),
      valueType: item.valueType,
    })),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaveMessage('');
    setSaveError('');

    if (!testForm.testName.trim() || !testForm.sampleType.trim()) {
      setSaveError('Add test name and sample type before saving.');
      return;
    }

    if (parameters.some((item) => !item.parameterName.trim())) {
      setSaveError('Every parameter row must have a parameter name.');
      return;
    }

    setIsSaving(true);

    try {
      const response = await createLaboratoryTest(buildPayload());
      setSaveMessage(
        response?.message || `${testForm.testName.trim()} test template saved successfully.`
      );
      setTestForm(INITIAL_TEST_FORM);
      setParameters([{ ...INITIAL_PARAMETER, id: Date.now() }]);
    } catch (error) {
      setSaveError(
        error.response?.data?.message ||
          'Unable to save test template. Check backend API.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <LaboratoryPanelLayout heading="Add Test" userName={userName}>
      {saveError ? <p className="form-error">{saveError}</p> : null}
      {saveMessage ? <p className="laboratory-form-message">{saveMessage}</p> : null}

      <section className="panel-card panel-card--wide laboratory-master-card">
        <div className="panel-section__header">
          <h3>Create Lab Test Template</h3>
          <span>Backend ready</span>
        </div>

        <p className="panel-section__copy">
          Format: first create the test header, then add all parameter rows that
          lab staff will later fill while entering results.
        </p>

        <form className="laboratory-test-form" onSubmit={handleSubmit}>
          <div className="laboratory-test-form__header">
            <label className="input-group" htmlFor="testName">
              <span>Test Name</span>
              <input
                id="testName"
                name="testName"
                value={testForm.testName}
                onChange={handleTestFormChange}
                placeholder="Example: Complete Blood Count"
              />
            </label>

            <label className="input-group" htmlFor="testCode">
              <span>Test Code</span>
              <input
                id="testCode"
                name="testCode"
                value={testForm.testCode}
                onChange={handleTestFormChange}
                placeholder="Example: CBC"
              />
            </label>

            <label className="input-group" htmlFor="sampleType">
              <span>Sample Type</span>
              <select
                id="sampleType"
                name="sampleType"
                value={testForm.sampleType}
                onChange={handleTestFormChange}
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

          <label className="input-group" htmlFor="description">
            <span>Description</span>
            <textarea
              id="description"
              name="description"
              value={testForm.description}
              onChange={handleTestFormChange}
              placeholder="Short description for this lab test"
              rows="3"
            />
          </label>

          <section className="laboratory-parameter-card">
            <div className="panel-section__header">
              <h3>Parameter Fields</h3>
              <button
                className="panel-action-button laboratory-add-row-button"
                type="button"
                onClick={handleAddParameter}
              >
                Add Parameter
              </button>
            </div>

            <div className="laboratory-parameter-list">
              {parameters.map((parameter, index) => (
                <div key={parameter.id} className="laboratory-parameter-row">
                  <div className="laboratory-parameter-row__title">
                    <strong>Parameter {index + 1}</strong>
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => handleRemoveParameter(parameter.id)}
                      disabled={parameters.length === 1}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="laboratory-parameter-grid">
                    <label className="input-group" htmlFor={`parameterName-${parameter.id}`}>
                      <span>Parameter Name</span>
                      <input
                        id={`parameterName-${parameter.id}`}
                        value={parameter.parameterName}
                        onChange={(event) =>
                          handleParameterChange(parameter.id, 'parameterName', event.target.value)
                        }
                        placeholder="Example: Hemoglobin"
                      />
                    </label>

                    <label className="input-group" htmlFor={`unit-${parameter.id}`}>
                      <span>Unit</span>
                      <input
                        id={`unit-${parameter.id}`}
                        value={parameter.unit}
                        onChange={(event) =>
                          handleParameterChange(parameter.id, 'unit', event.target.value)
                        }
                        placeholder="Example: g/dL"
                      />
                    </label>

                    <label className="input-group" htmlFor={`minValue-${parameter.id}`}>
                      <span>Min Value</span>
                      <input
                        id={`minValue-${parameter.id}`}
                        type="number"
                        value={parameter.minValue}
                        onChange={(event) =>
                          handleParameterChange(parameter.id, 'minValue', event.target.value)
                        }
                        placeholder="Example: 12"
                      />
                    </label>

                    <label className="input-group" htmlFor={`maxValue-${parameter.id}`}>
                      <span>Max Value</span>
                      <input
                        id={`maxValue-${parameter.id}`}
                        type="number"
                        value={parameter.maxValue}
                        onChange={(event) =>
                          handleParameterChange(parameter.id, 'maxValue', event.target.value)
                        }
                        placeholder="Example: 16"
                      />
                    </label>

                    <label className="input-group" htmlFor={`displayOrder-${parameter.id}`}>
                      <span>Display Order</span>
                      <input
                        id={`displayOrder-${parameter.id}`}
                        type="number"
                        min="1"
                        value={parameter.displayOrder}
                        onChange={(event) =>
                          handleParameterChange(parameter.id, 'displayOrder', event.target.value)
                        }
                        placeholder={`Example: ${index + 1}`}
                      />
                    </label>

                    <label className="input-group" htmlFor={`valueType-${parameter.id}`}>
                      <span>Value Type</span>
                      <select
                        id={`valueType-${parameter.id}`}
                        value={parameter.valueType}
                        onChange={(event) =>
                          handleParameterChange(parameter.id, 'valueType', event.target.value)
                        }
                      >
                        {VALUE_TYPE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="input-group" htmlFor={`normalText-${parameter.id}`}>
                    <span>Normal Text / Remark</span>
                    <input
                      id={`normalText-${parameter.id}`}
                      value={parameter.normalText}
                      onChange={(event) =>
                        handleParameterChange(parameter.id, 'normalText', event.target.value)
                      }
                      placeholder="Example: Negative / Clear / Normal"
                    />
                  </label>
                </div>
              ))}
            </div>
          </section>

          <div className="laboratory-test-form__actions">
            <button
              className="panel-action-button laboratory-save-button"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Test Template'}
            </button>
          </div>
        </form>
      </section>
    </LaboratoryPanelLayout>
  );
}

export default LaboratoryAddTestPage;
