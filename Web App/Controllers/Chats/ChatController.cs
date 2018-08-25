using Eleveight.Models.Domain.Chats;
using Eleveight.Models.Requests.App;
using Eleveight.Models.Requests.Chats;
using Eleveight.Models.Responses;
using Eleveight.Services;
using Eleveight.Services.App;
using Eleveight.Services.Chats;
using Eleveight.Services.Cryptography;
using System;
using System.Web.Http;

namespace Eleveight.Web.Controllers.Api.Chats
{
    [RoutePrefix("api/chats/chats")]
    public class ChatController : ApiController
    {
        private ICryptographyService _cryptographyService;
        private IChatService _chatService;
        private IAppLogService _appLogService;
        private IUserService _userService;

        public ChatController(IChatService chatService, ICryptographyService cryptographyService, IAppLogService appLogService, IUserService userService)
        {
            _chatService = chatService;
            _cryptographyService = cryptographyService;
            _appLogService = appLogService;
            _userService = userService;
        }

        [Route(), HttpGet]
        public IHttpActionResult GetAll()
        {
            try
            {
                ItemsResponse<Chat> response = new ItemsResponse<Chat>();
                response.Items = _chatService.ReadAll();
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
                ItemResponse<Chat> response = new ItemResponse<Chat>
                {
                    Item = _chatService.ReadById(id)
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
        public IHttpActionResult Post(ChatAddRequest model)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                ItemResponse<int> response = new ItemResponse<int>
                {
                    Item = _chatService.Insert(model)
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
        public IHttpActionResult Put(ChatUpdateRequest model)
        {
            try
            {
                _chatService.Update(model);
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
                _chatService.Delete(id);
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

        [Route("messages/{chatId:int}"), HttpGet]
        public IHttpActionResult GetUsersInChat(int chatId)
        {
            try
            {
                //string salt = _cryptographyService.GenerateRandomString(15);
                //string passwordHash = _cryptographyService.Hash("password123", salt, 1);
                ItemResponse<ChatUsersMessages> response = new ItemResponse<ChatUsersMessages>
                {
                    Item = _chatService.GetUsersinChat(chatId)
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

        [Route("user"), HttpGet]
        public IHttpActionResult GetChatsForUser()
        {
            try
            {
                //string salt = _cryptographyService.GenerateRandomString(15);
                //string passwordHash = _cryptographyService.Hash("password123", salt, 1);
                ItemsResponse<ChatsInfo> response = new ItemsResponse<ChatsInfo>
                {
                    Items = _chatService.GetAllChatAndInfoForCurrentUser()
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("read/{id:int}"), HttpGet]
        public IHttpActionResult MessagesRead(int id)
        {
            try
            {
                _chatService.UpdateMessagesRead(id);
                return Ok(new SuccessResponse());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}