
    [RoutePrefix("api/utilities/userInfo")]
    public class FormUserInfoController : ApiController
    {
        IFormUserInfoService _formUserInfoService;
        IUserService _userService;
        IAppLogService _appLogService;

        int _currentUserId;
        public FormUserInfoController(IFormUserInfoService formUserInfoService, IUserService userService, IAppLogService appLogService)
        {
            _formUserInfoService = formUserInfoService;
            _userService = userService;
            _appLogService = appLogService;
            _currentUserId = _userService.GetCurrentUserId();
        }
        [Route(), HttpPost]
        public IHttpActionResult GetAllInfo(FormUserInfoRequest data)
        {
            try
            {
                data.UserBaseId = _currentUserId;
                ItemResponse<string> response = new ItemResponse<string>
                {
                    Item = _formUserInfoService.GetInfo(data)
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
