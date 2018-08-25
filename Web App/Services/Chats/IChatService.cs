using Eleveight.Models.Domain.Chats;
using Eleveight.Models.Requests.Chats;
using System.Collections.Generic;

namespace Eleveight.Services.Chats
{
    public interface IChatService
    {
        void Delete(int id);

        int Insert(ChatAddRequest model);

        List<Chat> ReadAll();

        Chat ReadById(int id);

        void Update(ChatUpdateRequest model);

        ChatUsersMessages GetUsersinChat(int chatId);

        UserInfo GetUserInfo(int id);

        int GetChatIdFromTwoUsers(ChatUsers users);

        List<ChatsInfo> GetAllChatAndInfoForCurrentUser();
        void UpdateMessagesRead(int chatId);

    }
}