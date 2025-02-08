import axios, { AxiosError } from 'axios';
import { Team, TeamFormData } from '../types/team';

const API_BASE_URL = 'http://localhost:5015/api/Teams';

const handleError = (error: AxiosError) => {
  console.error('API Error:', error.response?.data || error.message);
  throw error;
};

export const api = {
  getAllTeams: async (): Promise<Team[]> => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      return [];
    }
  },

  getTeamById: async (id: number): Promise<Team> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  createTeam: async (team: TeamFormData): Promise<Team> => {
    try {
      const response = await axios.post(API_BASE_URL, team);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  updateTeam: async (id: number, team: TeamFormData): Promise<Team> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, team);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  deleteTeam: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },
};
