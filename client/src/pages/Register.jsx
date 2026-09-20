import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import Field from '../components/Field';
import Button from '../components/Button';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      return setError('The two passwords do not match.');
    }
    if (form.password.length < 6) {
      return setError('Use at least 6 characters for your password.');
    }

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Takes a few seconds. You can change your details later."
      footer={
        <>
          Already registered?{' '}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <p className="rounded-md border border-warn/25 bg-warn/5 px-3 py-2.5 text-sm text-warn">
            {error}
          </p>
        )}

        <Field
          id="name"
          name="name"
          label="Full name"
          autoComplete="name"
          placeholder="Menura Hansana"
          value={form.name}
          onChange={update}
          required
        />

        <Field
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={update}
          required
        />

        <Field
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          hint="Stored hashed with bcrypt. Nobody can read it back, including you."
          value={form.password}
          onChange={update}
          required
        />

        <Field
          id="confirm"
          name="confirm"
          type="password"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Type it once more"
          value={form.confirm}
          onChange={update}
          required
        />

        <Button type="submit" loading={loading} className="w-full">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
