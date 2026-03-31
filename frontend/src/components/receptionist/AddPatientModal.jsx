function AddPatientModal({
  isOpen,
  phoneNumber,
  onPhoneChange,
  onLookup,
  lookupError,
  lookupState,
  matchedPatients,
  registrationForm,
  onRegistrationChange,
  onRegisterPatient,
  onSelectExistingPatient,
  onClose,
  isSubmitting,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" role="presentation">
      <section
        className="patient-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-modal-title"
      >
        <div className="patient-modal__header">
          <div>
            <p className="patient-modal__eyebrow">Reception Desk</p>
            <h3 id="patient-modal-title">Add patient</h3>
          </div>
          <button className="patient-modal__close" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="patient-modal__body">
          <div className="patient-modal__lookup">
            <label className="input-group" htmlFor="patient-phone">
              <span>Patient phone number</span>
              <input
                id="patient-phone"
                name="phone"
                type="tel"
                placeholder="Enter patient phone number"
                value={phoneNumber}
                onChange={onPhoneChange}
              />
            </label>

            <button
              className="panel-action-button patient-modal__action"
              type="button"
              onClick={onLookup}
              disabled={isSubmitting}
            >
              Check phone number
            </button>
          </div>

          {lookupError ? <p className="form-error">{lookupError}</p> : null}

          {lookupState === 'existing' ? (
            <div className="patient-match-list">
              <div className="panel-section__header">
                <h3>Existing patients</h3>
                <span>{matchedPatients.length} found</span>
              </div>

              {matchedPatients.map((patient) => (
                <div key={patient.patientId} className="patient-match-card">
                  <div>
                    <strong>{patient.firstName} {patient.lastName}</strong>
                    <p>
                      {patient.gender} | {patient.dateOfBirth || 'DOB not added'}
                    </p>
                  </div>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => onSelectExistingPatient(patient)}
                  >
                    Add patient
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {lookupState === 'register' ? (
            <form className="patient-registration-form" onSubmit={onRegisterPatient}>
              <div className="panel-section__header">
                <h3>Patient registration</h3>
                <span>New patient</span>
              </div>

              <div className="patient-form-grid">
                <label className="input-group" htmlFor="firstName">
                  <span>First name</span>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={registrationForm.firstName}
                    onChange={onRegistrationChange}
                    required
                  />
                </label>

                <label className="input-group" htmlFor="lastName">
                  <span>Last name</span>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={registrationForm.lastName}
                    onChange={onRegistrationChange}
                    required
                  />
                </label>

                <label className="input-group" htmlFor="email">
                  <span>Email</span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={registrationForm.email}
                    onChange={onRegistrationChange}
                    required
                  />
                </label>

                <label className="input-group" htmlFor="phone">
                  <span>Phone</span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={registrationForm.phone}
                    onChange={onRegistrationChange}
                    required
                  />
                </label>

                <label className="input-group" htmlFor="dateOfBirth">
                  <span>Date of birth</span>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={registrationForm.dateOfBirth}
                    onChange={onRegistrationChange}
                  />
                </label>

                <label className="input-group" htmlFor="gender">
                  <span>Gender</span>
                  <select
                    id="gender"
                    name="gender"
                    value={registrationForm.gender}
                    onChange={onRegistrationChange}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="input-group" htmlFor="bloodGroup">
                  <span>Blood group</span>
                  <input
                    id="bloodGroup"
                    name="bloodGroup"
                    type="text"
                    value={registrationForm.bloodGroup}
                    onChange={onRegistrationChange}
                  />
                </label>

                <label className="input-group" htmlFor="password">
                  <span>Password</span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={registrationForm.password}
                    onChange={onRegistrationChange}
                    required
                  />
                </label>

                <label className="input-group patient-form-grid__full" htmlFor="address">
                  <span>Address</span>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    value={registrationForm.address}
                    onChange={onRegistrationChange}
                  />
                </label>

                <label className="input-group" htmlFor="emergencyContactName">
                  <span>Emergency contact name</span>
                  <input
                    id="emergencyContactName"
                    name="emergencyContactName"
                    type="text"
                    value={registrationForm.emergencyContactName}
                    onChange={onRegistrationChange}
                  />
                </label>

                <label className="input-group" htmlFor="emergencyContactPhone">
                  <span>Emergency contact phone</span>
                  <input
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    type="tel"
                    value={registrationForm.emergencyContactPhone}
                    onChange={onRegistrationChange}
                  />
                </label>
              </div>

              <button
                className="panel-action-button patient-registration-form__submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding patient...' : 'Register patient'}
              </button>
            </form>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default AddPatientModal;
