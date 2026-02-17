import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, Alert, Card } from 'react-bootstrap'
import { registerUser } from '../api/apiService'
import { useAuth } from '../context/AuthContext'

const Register = () => {
    const [formData, setFormData] = useState({
        accountName: '',
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await registerUser(formData)
            login(response.data.token, response.data.user)
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="auth-container">
            <Card className="auth-card" style={{ maxWidth: '500px' }}>
                <h2 className="text-center mb-4">Register Account</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Account Name</Form.Label>
                        <Form.Control name="accountName" placeholder="e.g. My Organization" required onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Main Company Name</Form.Label>
                        <Form.Control name="companyName" placeholder="e.g. Acme Corp" required onChange={handleChange} />
                    </Form.Group>
                    <div className="row">
                        <div className="col">
                            <Form.Group className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control name="firstName" required onChange={handleChange} />
                            </Form.Group>
                        </div>
                        <div className="col">
                            <Form.Group className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control name="lastName" required onChange={handleChange} />
                            </Form.Group>
                        </div>
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Label>Admin Email</Form.Label>
                        <Form.Control name="email" type="email" required onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" required onChange={handleChange} />
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </Form>
                <div className="text-center mt-3">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </Card>
        </div>
    )
}

export default Register
