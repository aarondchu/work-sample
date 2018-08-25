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
using System.Web.Script.Serialization;

namespace Eleveight.Web.Controllers.Api.Utilities
{

    [AllowAnonymous]
    [RoutePrefix("api/utilities/formbuilder")]
    public class FormBuilderController : ApiController
    {
        private IFormBuilderService _formService;
        private IUserService _userService;
        private int _currentUserId;
        public FormBuilderController(IFormBuilderService formService, IUserService userService)
        {
            _userService = userService;
            _formService = formService;
            _currentUserId = _userService.GetCurrentUserId();
        }
        [Route(), HttpPost]
        public IHttpActionResult InsertForm(FormBuilderAddRequest data)
        {
            try
            {
                data.CreatedById = _currentUserId;
                if (!ModelState.IsValid) return BadRequest(ModelState);
                ItemResponse<int> response = new ItemResponse<int>
                {
                    Item = _formService.InsertForm(data)
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("{id:int}"), HttpGet]
        public IHttpActionResult GetForm(int id)
        {
            try
            {
                ItemResponse<ScholarshipForm> response = new ItemResponse<ScholarshipForm>
                {
                    Item = _formService.GetForm(id)
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("{id:int}"), HttpPost]
        public IHttpActionResult SubmitForm(FormResults data)
        {
            try
            {
                data.UserBaseId = _currentUserId;
                ItemResponse<int> response = new ItemResponse<int>
                {
                    Item = _formService.SubmitForm(data)
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("results/{id:int}"), HttpGet]
        public IHttpActionResult GetResultsForScholarship(int id)
        {
            try
            {
                ItemsResponse<FormResultsListItem> response = new ItemsResponse<FormResultsListItem>
                {
                    Items = _formService.GetResultsList(id)
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("showScholarships/{userBaseId:int}"), HttpGet]
        public IHttpActionResult ShowScholarships(int userBaseId)
        {
            try
            {
                userBaseId = _userService.GetCurrentUserId();
                ItemsResponse<ShowScholarshipsByUserId> response = new ItemsResponse<ShowScholarshipsByUserId>
                {
                    Items = _formService.ShowScholarshipsByUserId(userBaseId)
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("{id:int}/{userId:int}"), HttpGet]
        public IHttpActionResult GetResultsForScholarship(int id, int userId)
        {
            try
            {
                ItemResponse<FormResultsUser> response = new ItemResponse<FormResultsUser>
                {
                    Item = _formService.GetUserForm(id, userId)
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
