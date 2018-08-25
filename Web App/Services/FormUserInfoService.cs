using Eleveight.Models.Domain.Utilities;
using Eleveight.Models.Requests.Utilities;
using Eleveight.Services.Tools;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Eleveight.Services.Utilities
{
    public class FormUserInfoService : BaseService, IFormUserInfoService
    {
        public string GetInfo(FormUserInfoRequest data)
        {
            string item = "";
            DataProvider.ExecuteCmd("dbo.UserProfile_GetInfoFromDropDown",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@userBaseId", data.UserBaseId, SqlDbType.Int));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@dbColumns", data.DbColumns, SqlDbType.NVarChar, 2000
                        ));

                },
                singleRecordMapper: (IDataReader reader, short resultSet) =>
                {
                    item = reader.GetString(0);
                });
            return item;
        }
    }
}
