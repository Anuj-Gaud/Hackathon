import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [attendance, setAttendance] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [profileRes, attendanceRes, statsRes] = await Promise.all([
        api.get('/student/profile'),
        api.get('/student/attendance'),
        api.get('/student/attendance/stats')
      ])
      setProfile(profileRes.data)
      setAttendance(attendanceRes.data)
      setStats(statsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (profile?.approval_status === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold mb-4">Awaiting Approval</h2>
          <p className="text-gray-600 mb-6">
            Your registration is pending admin approval. You'll be notified once approved.
          </p>
          <button onClick={logout} className="text-purple-600 hover:underline">
            Logout
          </button>
        </div>
      </div>
    )
  }

  if (profile?.approval_status === 'rejected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">Registration Rejected</h2>
          <p className="text-gray-600 mb-6">
            {profile.rejection_reason || 'Your registration was rejected. Please contact admin.'}
          </p>
          <button onClick={logout} className="text-purple-600 hover:underline">
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Portal</h1>
          <div className="flex items-center gap-4">
            <span>{user?.name}</span>
            <button onClick={logout} className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm mb-2">Total Sessions</h3>
            <p className="text-3xl font-bold text-purple-600">{stats?.total_sessions || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm mb-2">Attended</h3>
            <p className="text-3xl font-bold text-green-600">{stats?.attended_sessions || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm mb-2">Attendance Rate</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.attendance_rate || 0}%</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Attendance History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Class</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record.id} className="border-t">
                    <td className="px-6 py-4">
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">{record.class_id || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        record.verification_status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.verification_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {record.face_confidence ? `${(record.face_confidence * 100).toFixed(1)}%` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {attendance.length === 0 && (
              <div className="text-center py-12 text-gray-500">No attendance records</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
