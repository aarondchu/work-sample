
    public class FormBuilderService : BaseService, IFormBuilderService
    {
        public int InsertForm(FormBuilderAddRequest data)
        {
            int returnValue = 0;
            DataProvider.ExecuteNonQuery("dbo.Form_Insert",
               inputParamMapper: (SqlParameterCollection inputs) =>
               {
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@ScholarshipId", data.ScholarshipId, SqlDbType.Int));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@Form", data.Form, SqlDbType.NVarChar, -1));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@CreatedById", data.CreatedById, SqlDbType.Int));


                   SqlParameter idOut = new SqlParameter("@Id", 0);
                   idOut.Direction = ParameterDirection.Output;

                   inputs.Add(idOut);
               },
               returnParameters: (SqlParameterCollection inputs) =>
               {
                   int.TryParse(inputs["@Id"].Value.ToString(), out returnValue);
               }
               );
            return returnValue;
        }
        public ScholarshipForm GetForm(int scholarshipId)
        {
            ScholarshipForm data = new ScholarshipForm();
            DataProvider.ExecuteCmd("dbo.Form_SelectById",
               inputParamMapper: (SqlParameterCollection inputs) =>
               {
                   inputs.AddWithValue("@scholarshipId", scholarshipId);
               },
               singleRecordMapper: (IDataReader reader, short resultSet) =>
               {
                   data = DataMapper<ScholarshipForm>.Instance.MapToObject(reader);
               });
            return data;
        }
        public List<FormResultsListItem> GetResultsList(int scholarshipId)
        {
            List<FormResultsListItem> data = new List<FormResultsListItem>();
            DataProvider.ExecuteCmd("dbo.FormUserResults_SelectResultsByScholarshipId",
               inputParamMapper: (SqlParameterCollection inputs) =>
               {
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@scholarshipId", scholarshipId, SqlDbType.Int));
               },
               singleRecordMapper: (IDataReader reader, short resultSet) =>
               {
                   data.Add(DataMapper<FormResultsListItem>.Instance.MapToObject(reader));
               });
            return data;
        }

        public List<ShowScholarshipsByUserId> ShowScholarshipsByUserId(int userBaseId)
        {
            List<ShowScholarshipsByUserId> data = new List<ShowScholarshipsByUserId>();
            DataProvider.ExecuteCmd("dbo.FormUserResults_SelectResultsByUserBaseId",
               inputParamMapper: (SqlParameterCollection inputs) =>
               {
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@userBaseId", userBaseId, SqlDbType.Int));
               },
               singleRecordMapper: (IDataReader reader, short resultSet) =>
               {
                   data.Add(DataMapper<ShowScholarshipsByUserId>.Instance.MapToObject(reader));
               });
            return data;
        }

        public FormResultsUser GetUserForm(int id, int userId)
        {
            FormResultsUser data = new FormResultsUser();
            DataProvider.ExecuteCmd("dbo.FormUserResults_SelectResultsByScholarshipAndUserId",
               inputParamMapper: (SqlParameterCollection inputs) =>
               {
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@scholarshipId", id, SqlDbType.Int));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@userbaseId", userId, SqlDbType.Int));
               },
               singleRecordMapper: (IDataReader reader, short resultSet) =>
               {
                   data = DataMapper<FormResultsUser>.Instance.MapToObject(reader);
               });
            return data;
        }
        public int SubmitForm(FormResults data)
        {
            int returnValue = 0;
            DataProvider.ExecuteNonQuery("dbo.FormUserResults_Insert",
               inputParamMapper: (SqlParameterCollection inputs) =>
               {
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@userBaseId", data.UserBaseId, SqlDbType.Int));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@formId", data.FormId, SqlDbType.Int));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@results", data.Results, SqlDbType.NVarChar, -1));


                   SqlParameter idOut = new SqlParameter("@Id", 0);
                   idOut.Direction = ParameterDirection.Output;

                   inputs.Add(idOut);
               },
               returnParameters: (SqlParameterCollection inputs) =>
               {
                   int.TryParse(inputs["@Id"].Value.ToString(), out returnValue);
               }
               );
            return returnValue;
        }
    }

