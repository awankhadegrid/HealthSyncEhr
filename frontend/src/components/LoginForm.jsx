import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginByRole } from '../services/authService';

const ROLE_CONTENT = {
  receptionist: {
    badge: 'RC',
    title: 'Receptionist Login',
    subtitle: 'Access appointments, patient registration, and front-desk workflows.',
    emailPlaceholder: 'reception@healthsync.com',
    helper: 'Use your front-desk account to continue into HealthSync.',
    route: '/receptionist/dashboard',
    buttonLabel: 'Receptionist',
  },
  doctor: {
    badge: 'DR',
    title: 'Doctor Login',
    subtitle: 'Review consultations, patient history, and daily clinical tasks.',
    emailPlaceholder: 'doctor@healthsync.com',
    helper: 'Use your clinician account to securely enter the EHR dashboard.',
    route: '/doctor/dashboard',
    buttonLabel: 'Doctor',
  },
  pharmacy: {
    badge: 'PH',
    title: 'Pharmacy Login',
    subtitle: 'Manage prescriptions, medicines, and dispensing workflows securely.',
    emailPlaceholder: 'pharmacy@healthsync.com',
    helper: 'Use your pharmacy account to access medicine and dispensing operations.',
    route: '/pharmacy/dashboard',
    buttonLabel: 'Pharmacy',
  },
};

function LoginForm() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('receptionist');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const activeRole = ROLE_CONTENT[selectedRole];

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await loginByRole(selectedRole, {
        email: formData.email,
        password: formData.password,
      });

      if (!response.success) {
        setErrorMessage(response.message || 'Invalid credentials.');
        return;
      }

      const token = response.token || response.accessToken;
      const user = response.user || {
        name: formData.email || activeRole.title,
        role: selectedRole,
      };

      if (token) {
        localStorage.setItem('authToken', token);
      }

      localStorage.setItem('userRole', selectedRole);
      localStorage.setItem('userData', JSON.stringify(user));

      navigate(activeRole.route, {
        state: { user },
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          'Unable to sign in. Check your backend endpoint and credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="login-panel" aria-label="Login form">
      <div className={`login-card login-card--${selectedRole}`}>
        <div className="login-card__header">
          <div className="brand-badge">{activeRole.badge}</div>
          <div>
            <p className="login-eyebrow">HealthSync EHR</p>
            <h2>{activeRole.title}</h2>
          </div>
        </div>

        <div className="role-switcher" aria-label="Choose login role">
          <button
            className={`role-switcher__button ${selectedRole === 'receptionist' ? 'is-active' : ''}`}
            type="button"
            onClick={() => handleRoleChange('receptionist')}
          >
            Receptionist
          </button>
          <button
            className={`role-switcher__button ${selectedRole === 'doctor' ? 'is-active' : ''}`}
            type="button"
            onClick={() => handleRoleChange('doctor')}
          >
            Doctor
          </button>
          <button
            className={`role-switcher__button ${selectedRole === 'pharmacy' ? 'is-active' : ''}`}
            type="button"
            onClick={() => handleRoleChange('pharmacy')}
          >
            Pharmacy
          </button>
        </div>

        <p className="login-copy">{activeRole.subtitle}</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="input-group" htmlFor="email">
            <span>Email address</span>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={activeRole.emailPlaceholder}
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className="input-group" htmlFor="password">
            <span>Password</span>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </label>

          <div className="form-row">
            <label className="checkbox-group" htmlFor="rememberMe">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              <span>Remember me</span>
            </label>

            <button className="text-button" type="button">
              Forgot password?
            </button>
          </div>

          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Signing in...'
              : `Sign in as ${activeRole.buttonLabel}`}
          </button>
        </form>

        <p className="support-copy">{activeRole.helper}</p>
      </div>
    </section>
  );
}

export default LoginForm;
