using Eleveight.Models.Domain.Chats;
using Eleveight.Models.Requests.Chats;
using Eleveight.Services.Tools;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Eleveight.Services.Chats
{
    public class ChatMessageService : BaseService, IChatMessageService
    {
        public List<ChatMessage> ReadAll()
        {
            List<ChatMessage> list = new List<ChatMessage>();

            DataProvider.ExecuteCmd("dbo.ChatMessage_SelectAll",
                inputParamMapper: null,
                singleRecordMapper: (IDataReader reader, short resultSet) =>
                {
                    list.Add(DataMapper<ChatMessage>.Instance.MapToObject(reader));
                });
            return list;
        }

        public ChatMessage ReadById(int id)
        {
            ChatMessage appSettingTable = new ChatMessage();

            DataProvider.ExecuteCmd("dbo.ChatMessage_SelectById",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.AddWithValue("@Id", id);
                },
                singleRecordMapper: (IDataReader reader, short resultSet) =>
                {
                    appSettingTable = DataMapper<ChatMessage>.Instance.MapToObject(reader);
                });
            return appSettingTable;
        }

        public int Insert(ChatMessageAddRequest model)
        {
            int returnValue = 0;

            DataProvider.ExecuteNonQuery("dbo.ChatMessage_Insert",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@SenderUserBaseId", model.SenderUserBaseId, SqlDbType.Int));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@Message", model.Message, SqlDbType.NVarChar, 1000));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@ChatId", model.ChatId, SqlDbType.Int));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@Id", 0, SqlDbType.Int, paramDirection: ParameterDirection.Output));
                },
                returnParameters: (SqlParameterCollection inputs) =>
                {
                    int.TryParse(inputs["@Id"].Value.ToString(), out returnValue);
                });
            return returnValue;
        }

        public void Update(ChatMessageUpdateRequest model)
        {
            DataProvider.ExecuteNonQuery("dbo.ChatMessage_Update",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@Id", model.Id, SqlDbType.Int));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@Message", model.Message, SqlDbType.NVarChar, 1000));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@MessageRead", model.MessageRead, SqlDbType.Bit));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@ReadDate", model.ReadDate, SqlDbType.DateTime2, 7));
                },
                returnParameters: null
                );
        }

        public void Delete(int id)
        {
            DataProvider.ExecuteNonQuery("dbo.ChatMessage_Delete",
                inputParamMapper: (SqlParameterCollection input) =>
                {
                    input.AddWithValue("@Id", id);
                },
                returnParameters: null
                );
        }
    }
}