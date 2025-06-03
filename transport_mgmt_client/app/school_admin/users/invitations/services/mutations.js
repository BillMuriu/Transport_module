import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export const useCreateInvitation = () => {
  return useMutation({
    mutationFn: async (invitationData) => {
      console.log("Sending invitation data:", invitationData); // <-- log here
      const response = await axios.post(
        `${API_BASE_URL}/users/invite-user/`,
        invitationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Invitation created successfully:", data);
    },
    onError: (error) => {
      console.error(
        "Invitation creation failed:",
        error.response?.data || error.message
      );
    },
  });
};
