import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, Alert, Card } from 'react-bootstrap'
import { loginUser } from '../api/apiService'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await loginUser({ email, password })
            login(response.data.token, response.data.user)
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <Card className="auth-card">
                <h2 className="text-center mb-4">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </Form>
                <div className="text-center mt-3">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </Card>
        </div>
    )
}

export default Login
