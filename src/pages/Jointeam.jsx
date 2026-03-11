import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export default function JoinTeam() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const [teamName, setTeamName] = useState('');

    useEffect(() => {
        // ✅ FIX: your auth.js saves token under key "token", not "access_token"
        const accessToken = localStorage.getItem('token');

        if (!accessToken) {
            localStorage.setItem('pending_invite', token);
            setStatus('needsLogin');
            return;
        }

        attemptJoin();
    }, [token]);

    const attemptJoin = async () => {
        setStatus('loading');
        try {
            const res = await api.post(`/teams/join/${token}`);
            setTeamName(res.data.team_name || 'the team');
            setStatus('success');
            localStorage.removeItem('pending_invite');
            setTimeout(() => navigate('/teams'), 2200);
        } catch (err) {
            const detail = err?.response?.data?.detail || 'Something went wrong.';
            setMessage(detail);
            setStatus('error');
            if (detail === 'Already a member of this team') {
                setTimeout(() => navigate('/teams'), 2000);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-sm text-center">

                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-extrabold text-sm">T</span>
                    </div>
                    <span className="text-lg font-extrabold text-gray-900">TeamPulse</span>
                </div>

                {status === 'loading' && (
                    <>
                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                            <Loader size={28} className="text-blue-500 animate-spin" />
                        </div>
                        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Joining team…</h2>
                        <p className="text-sm text-gray-400">Please wait a moment.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} className="text-green-500" />
                        </div>
                        <h2 className="text-xl font-extrabold text-gray-900 mb-2">
                            You joined <span className="text-blue-600">{teamName}</span>!
                        </h2>
                        <p className="text-sm text-gray-400 mb-5">Welcome to the team. Redirecting…</p>
                        <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full"
                                style={{ width: '100%', transition: 'width 2.2s linear' }} />
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <XCircle size={32} className="text-red-400" />
                        </div>
                        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Could not join</h2>
                        <p className="text-sm text-gray-500 mb-5">{message}</p>
                        <button onClick={() => navigate('/teams')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                            Go to Teams
                        </button>
                    </>
                )}

                {status === 'needsLogin' && (
                    <>
                        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 text-3xl">
                            🔐
                        </div>
                        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Login required</h2>
                        <p className="text-sm text-gray-500 mb-5">
                            You need to be logged in to accept this invite.<br />
                            We'll bring you back here automatically after login.
                        </p>
                        <button onClick={() => navigate('/login')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors mb-3">
                            Log in to TeamPulse
                        </button>
                        <button onClick={() => navigate('/register')}
                            className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                            Create an account
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}