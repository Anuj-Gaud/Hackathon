import { Link } from 'react-router-dom'
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">ISAVS</h1>
          <p className="text-xl text-blue-100">Intelligent Student Attendance Verification System</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Choose Your Portal</h2>
          <p className="text-blue-100 text-lg">Select your role to continue</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Student Portal */}
          <Link to="/login/student">
            <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 cursor-pointer group">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FaUserGraduate className="text-4xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Student Portal</h3>
                <p className="text-gray-600 mb-6">
                  Access your attendance records, view your profile, and track your progress
                </p>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold group-hover:shadow-lg transition-all">
                  Student Login →
                </div>
              </div>
            </div>
          </Link>

          {/* Teacher Portal */}
          <Link to="/login/teacher">
            <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 cursor-pointer group">
              <div className="text-center">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FaChalkboardTeacher className="text-4xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Teacher Portal</h3>
                <p className="text-gray-600 mb-6">
                  Manage attendance sessions, enroll students, and view comprehensive reports
                </p>
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold group-hover:shadow-lg transition-all">
                  Teacher Login →
                </div>
              </div>
            </div>
          </Link>

          {/* Admin Portal */}
          <Link to="/login">
            <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 cursor-pointer group">
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FaUserShield className="text-4xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Admin Portal</h3>
                <p className="text-gray-600 mb-6">
                  Approve students, manage teachers, and oversee the entire system
                </p>
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold group-hover:shadow-lg transition-all">
                  Admin Login →
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 text-center text-white/80">
        <p className="text-sm">
          Secure biometric attendance verification with face recognition technology
        </p>
      </div>
    </div>
  )
}
