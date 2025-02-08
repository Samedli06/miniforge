import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Team, TeamFormData } from '../types/team';

interface TeamFormProps {
  onSubmit: (data: TeamFormData) => void;
  initialData?: Team;
  onCancel: () => void;
}

export const TeamForm = ({ onSubmit, initialData, onCancel }: TeamFormProps) => {
  const [formData, setFormData] = useState<TeamFormData>({
    name: '',
    city: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ name: initialData.name, city: initialData.city });
    }
  }, [initialData]);

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Team Name</label>
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="text"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          required
        />
      </div>
      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          {initialData ? 'Update' : 'Create'} Team
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          Cancel
        </motion.button>
      </div>
    </motion.form>
  );
};
