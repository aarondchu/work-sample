using Eleveight.Models.Domain.Chats;
using Eleveight.Models.Requests.Chats;
using System.Collections.Generic;

namespace Eleveight.Services.Chats
{
    public interface IChatMessageService
    {
        List<ChatMessage> ReadAll();

        ChatMessage ReadById(int id);

        int Insert(ChatMessageAddRequest model);

        void Update(ChatMessageUpdateRequest model);

        void Delete(int id);
    }
}