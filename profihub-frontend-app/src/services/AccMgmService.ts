import { AxiosResponse } from "axios";
import { accMgmtApi } from "../http";
import { AccMgmResponse } from "../models/Response/AccMgmResponse";

export interface AvatarResponse {
  avatar: string;
}

export default class AccMgmService {
  static async viewProfile(
    link: string
  ): Promise<AxiosResponse<AccMgmResponse>> {
    return accMgmtApi.get<AccMgmResponse>(`/view-profile/${link}`);
  }

  static async viewMyProfile(): Promise<AxiosResponse<AccMgmResponse>> {
    return accMgmtApi.get<AccMgmResponse>(`/view-my-profile`);
  }

  static async getAvatar(): Promise<string> {
    const response = await accMgmtApi.get<AvatarResponse>('/user-avatar');
    return response.data.avatar;
  }

  static async changeAvatar(
    formData: FormData
  ): Promise<AxiosResponse<{ avatar: string }>> {
    return accMgmtApi.patch<{ avatar: string }>(
      "/settings/avatar",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  }

  static async resetAvatar(): Promise<AxiosResponse<void>> {
    return accMgmtApi.delete<void>("/settings/avatar");
  }

  static async updateProfileBio(
    bio: string
  ): Promise<AxiosResponse<AccMgmResponse>> {
    return accMgmtApi.patch<AccMgmResponse>("/settings/update-bio", { bio });
  }

  static async resetPassword(
    data: {
      currentPassword?: string;
      newPassword: string;
      resetToken?: string;
    }
  ): Promise<AxiosResponse<void>> {
    return accMgmtApi.patch<void>("/settings/password", data);
  }

  static async deleteProfile(): Promise<AxiosResponse<void>> {
    return accMgmtApi.delete<void>("/settings/delete-profile");
  }
  
  static async changeStatus(data: { status: boolean }) {
  return accMgmtApi.patch<void>('/settings/status', data);
}
}
