
    [RoutePrefix("api/chats/messages")]
    public class ChatMessageController : ApiController
    {
        private IChatMessageService _chatMessageService;
        private IAppLogService _appLogService;
        private IUserService _userService;

        public ChatMessageController(IChatMessageService chatMessageService, IAppLogService appLogService, IUserService userService)
        {
            _chatMessageService = chatMessageService;
            _appLogService = appLogService;
            _userService = userService;
        }

        [Route(), HttpGet]
        public IHttpActionResult GetAll()
        {
            try
            {
                ItemsResponse<ChatMessage> response = new ItemsResponse<ChatMessage>();
                response.Items = _chatMessageService.ReadAll();
                return Ok(response);
            }
            catch (Exception ex)
            {
                int currentUser = _userService.GetCurrentUserId();
                _appLogService.Insert(new AppLogAddRequest
                {
                    AppLogTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name,
                    UserBaseId = currentUser
                });

                return BadRequest(ex.Message);
            }
        }

        [Route("{id:int}"), HttpGet]
        public IHttpActionResult GetById(int id)
        {
            try
            {
                ItemResponse<ChatMessage> response = new ItemResponse<ChatMessage>
                {
                    Item = _chatMessageService.ReadById(id)
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                int currentUser = _userService.GetCurrentUserId();
                _appLogService.Insert(new AppLogAddRequest
                {
                    AppLogTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name,
                    UserBaseId = currentUser
                });

                return BadRequest(ex.Message);
            }
        }

        [Route(), HttpPost]
        public IHttpActionResult Post(ChatMessageAddRequest model)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState); // validation check on model
                ItemResponse<int> response = new ItemResponse<int>
                {
                    Item = _chatMessageService.Insert(model) // on is valid and success, set Item to hold response id
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                int currentUser = _userService.GetCurrentUserId();
                _appLogService.Insert(new AppLogAddRequest
                {
                    AppLogTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name,
                    UserBaseId = currentUser
                });

                return BadRequest(ex.Message);
            }
        }

        [Route("{id:int}"), HttpPut]
        public IHttpActionResult Put(ChatMessageUpdateRequest model)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState); // validation check on model
                _chatMessageService.Update(model); // on is valid and success, set Item to hold response id
                return Ok(new SuccessResponse());
            }
            catch (Exception ex)
            {
                int currentUser = _userService.GetCurrentUserId();
                _appLogService.Insert(new AppLogAddRequest
                {
                    AppLogTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name,
                    UserBaseId = currentUser
                });

                return BadRequest(ex.Message);
            }
        }

        [Route("{id:int}"), HttpDelete]
        public IHttpActionResult Delete(int id)
        {
            try
            {
                _chatMessageService.Delete(id);
                return Ok(new SuccessResponse());
            }
            catch (Exception ex)
            {
                int currentUser = _userService.GetCurrentUserId();
                _appLogService.Insert(new AppLogAddRequest
                {
                    AppLogTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name,
                    UserBaseId = currentUser
                });

                return BadRequest(ex.Message);
            }
        }

    }
