using Eleveight.Models.Domain.Chats;
using Eleveight.Models.Requests.Chats;
using Eleveight.Services.Tools;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Eleveight.Services.Chats
{
    public class ChatService : BaseService, IChatService
    {
        private IUserService _userService;
        private int currentUserId;

        public ChatService(IUserService userService)
        {
            _userService = userService;
            currentUserId = _userService.GetCurrentUserId();
        }

        public List<Chat> ReadAll()
        {
            List<Chat> list = new List<Chat>();
            DataProvider.ExecuteCmd("dbo.Chat_SelectAll",
                inputParamMapper: null,
                singleRecordMapper: (IDataReader reader, short resultSet) =>
                {
                    list.Add(DataMapper<Chat>.Instance.MapToObject(reader));
                });
            return list;
        }

        public Chat ReadById(int id)
        {
            Chat chat = new Chat();
            DataProvider.ExecuteCmd("dbo.Chat_SelectById",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.AddWithValue("@Id", id);
                },
                singleRecordMapper: (IDataReader reader, short resultSet) =>
                {
                    chat = DataMapper<Chat>.Instance.MapToObject(reader);
                });
            return chat;
        }

        public int Insert(ChatAddRequest model)
        {
            int returnValue = 0;

            DataProvider.ExecuteNonQuery("dbo.Chat_Insert",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.AddWithValue("@ChatTitle", model.ChatTitle);

                    SqlParameter idOut = new SqlParameter("@Id", 0);
                    idOut.Direction = ParameterDirection.Output;

                    inputs.Add(idOut);
                },
                returnParameters: (SqlParameterCollection inputs) =>
                {
                    int.TryParse(inputs["@Id"].Value.ToString(), out returnValue);
                });
            return returnValue;
        }

        public void Update(ChatUpdateRequest model)
        {
            DataProvider.ExecuteNonQuery("dbo.Chat_Update",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.AddWithValue("@Id", model.Id);
                    inputs.AddWithValue("@ChatTitle", model.ChatTitle);
                });
        }

        public void Delete(int id)
        {
            DataProvider.ExecuteNonQuery("dbo.Chat_Delete",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.AddWithValue("@Id", id);
                });
        }

        public ChatUsersMessages GetUsersinChat(int chatId)
        {
            ChatUsersMessages data = new ChatUsersMessages();
            List<UserInfo> info = new List<UserInfo>();
            UserInfo currentUserInfo = GetUserInfo(currentUserId);
            List<ChatMessage> messages = new List<ChatMessage>();
            DataProvider.ExecuteCmd("dbo.Chat_GetUsersAndMessagesByChatId",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@chatId", chatId, SqlDbType.Int));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@userId", currentUserId, SqlDbType.Int));
                },
                singleRecordMapper: (IDataReader reader, short resultSet) =>
                {
                    if (resultSet == 0)
                    {
                        currentUserInfo = DataMapper<UserInfo>.Instance.MapToObject(reader);
                    }
                    if (resultSet == 1)
                    {
                        info.Add(DataMapper<UserInfo>.Instance.MapToObject(reader));
                    }
                    if (resultSet == 2)
                    {
                        messages.Add(DataMapper<ChatMessage>.Instance.MapToObject(reader));
                    }
                });
            data.Messages = messages;
            data.CurrentUserInfo = currentUserInfo;
            data.UsersInfo = info;
            return data;
        }
        public void UpdateMessagesRead(int chatId)
        {
            DataProvider.ExecuteNonQuery("dbo.Chat_UpdateMessageRead",
                inputParamMapper: (SqlParameterCollection inputs) =>
                 {
                     inputs.Add(SqlDbParameter.Instance.BuildParameter("@chatId", chatId, SqlDbType.Int));
                     inputs.Add(SqlDbParameter.Instance.BuildParameter("@id", currentUserId, SqlDbType.Int));
                 });
        }
        public UserInfo GetUserInfo(int id)
        {
            UserInfo info = new UserInfo();
            DataProvider.ExecuteCmd("dbo.User_GetAllInfoById",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.AddWithValue("@Id", id);
                },
                singleRecordMapper: (IDataReader reader, short resultSet) =>
                {
                    info = DataMapper<UserInfo>.Instance.MapToObject(reader);
                });
            return info;
        }

        public int GetChatIdFromTwoUsers(ChatUsers users)
        {
            int chatId = 0;
            DataProvider.ExecuteNonQuery("dbo.Chat_GetChatIdByUserIds",
                inputParamMapper: (SqlParameterCollection inputs) =>
                 {
                     inputs.AddWithValue("@user1", users.User1);
                     inputs.AddWithValue("@user2", users.User2);

                     SqlParameter idOut = new SqlParameter("@chatId", 0);
                     idOut.Direction = ParameterDirection.Output;

                     inputs.Add(idOut);
                 },
                returnParameters: (SqlParameterCollection inputs) =>
                {
                    int.TryParse(inputs["@chatId"].Value.ToString(), out chatId);
                });
            return chatId;
        }

        public List<ChatsInfo> GetAllChatAndInfoForCurrentUser()
        {
            List<ChatUserRel> ids = new List<ChatUserRel>();
            List<ChatsInfo> info = new List<ChatsInfo>();
            List<UserInfo> userInfos = new List<UserInfo>();
            List<ChatMessageLatest> messages = new List<ChatMessageLatest>();
            List<ChatMessageUnread> unreadCount = new List<ChatMessageUnread>();
            DataProvider.ExecuteCmd("dbo.Chat_GetAllChatsForUser",
                inputParamMapper: (SqlParameterCollection inputs) =>
                 {
                     inputs.Add(SqlDbParameter.Instance.BuildParameter("@id", currentUserId, SqlDbType.Int));
                 }, singleRecordMapper: (IDataReader reader, short resultSet) =>
                  {
                      if (resultSet == 0)
                          ids.Add(DataMapper<ChatUserRel>.Instance.MapToObject(reader));
                      if (resultSet == 1)
                          userInfos.Add(DataMapper<UserInfo>.Instance.MapToObject(reader));
                      if (resultSet == 2)
                          messages.Add(DataMapper<ChatMessageLatest>.Instance.MapToObject(reader));
                      if (resultSet == 3)
                          unreadCount.Add(DataMapper<ChatMessageUnread>.Instance.MapToObject(reader));
                  });
            ids.ForEach(idPair =>
            {
                if (info.Exists(item => item.Id == idPair.ChatId))
                {
                    ChatsInfo chat = info.Find(item => item.Id == idPair.ChatId);
                    if (chat.Users.TrueForAll(item => item.Id != idPair.UserBaseId))
                    {
                        chat.Users.Add(userInfos.Find(item => item.Id == idPair.UserBaseId));
                    }
                }
                else
                {
                    ChatsInfo chat = new ChatsInfo();
                    List<UserInfo> userInfo = new List<UserInfo>();
                    userInfo.Add(userInfos.Find(item => item.Id == idPair.UserBaseId));
                    chat.Id = idPair.ChatId;
                    chat.Users = userInfo;
                    chat.Unread = unreadCount.Find(item => item.ChatId == idPair.ChatId) == null ? 0 : unreadCount.Find(item => item.ChatId == idPair.ChatId).Unread;
                    chat.newestMessage = messages.Find(item => item.ChatId == idPair.ChatId) == null ? "" : messages.Find(item => item.ChatId == idPair.ChatId).Message;
                    info.Add(chat);
                }
            });
            return info;
        }

    }
}