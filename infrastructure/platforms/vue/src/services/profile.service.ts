import axios from './axios'

export interface UpdateProfileDTO {
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
  updatedAt: string
}

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await axios.get<UserProfile>('/profile')
    return data
  },

  async updateProfile(profile: UpdateProfileDTO): Promise<UserProfile> {
    const { data } = await axios.put<UserProfile>('/profile', profile)
    return data
  },
}
