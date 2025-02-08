import { useState, useEffect } from 'react';
import { Team, TeamFormData } from '../types/team';
import { api } from '../services/api';
import { TeamCard } from '../components/TeamCard';
import { TeamForm } from '../components/TeamForm';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await api.getAllTeams();
      setTeams(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch teams';
      setError(errorMessage);
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSubmit = async (data: TeamFormData) => {
    try {
      setLoading(true);
      if (selectedTeam) {
        await api.updateTeam(selectedTeam.id, data);
      } else {
        await api.createTeam(data);
      }
      await fetchTeams();
      setShowForm(false);
      setSelectedTeam(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save team';
      setError(errorMessage);
      console.error('Error saving team:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await api.deleteTeam(id);
      await fetchTeams();
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete team';
      setError(errorMessage);
      console.error('Error deleting team:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Teams Management</h1>
          <p className="text-gray-600 mb-8">Manage your teams with ease</p>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedTeam(null);
              setShowForm(true);
            }}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Team
            </span>
          </motion.button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onEdit={(team) => {
                    setSelectedTeam(team);
                    setShowForm(true);
                  }}
                  onDelete={handleDelete}
                  onClick={(team) => {
                    setSelectedTeam(team);
                    setShowDetails(true);
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  {selectedTeam ? 'Edit Team' : 'Add New Team'}
                </h2>
                <TeamForm
                  onSubmit={handleSubmit}
                  initialData={selectedTeam || undefined}
                  onCancel={() => {
                    setShowForm(false);
                    setSelectedTeam(null);
                  }}
                />
              </motion.div>
            </motion.div>
          )}

          {showDetails && selectedTeam && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Team Details</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Team Name</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedTeam.name}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">City</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedTeam.city}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDetails(false)}
                    className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
