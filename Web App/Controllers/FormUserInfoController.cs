using Eleveight.Models.Domain.Utilities;
using Eleveight.Models.Requests.Utilities;
using Eleveight.Models.Responses;
using Eleveight.Services;
using Eleveight.Services.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Eleveight.Services.App;
using System.Web.Script.Serialization;

namespace Eleveight.Web.Controllers.Api.Utilities
{
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
}