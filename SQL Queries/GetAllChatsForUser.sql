USE [C56]
GO
/****** Object:  StoredProcedure [dbo].[Chat_GetAllChatsForUser]    Script Date: 8/26/2018 7:02:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Aaron Chu
-- Create date: 7/12
-- Description:	Get All Chats for UserId
/* Test Script
DECLARE	@return_value int

EXEC	@return_value = [dbo].[Chat_GetAllChatsForUser]
		@id = 23

SELECT	'Return Value' = @return_value
*/
-- =============================================
ALTER PROCEDURE [dbo].[Chat_GetAllChatsForUser]
	-- Add the parameters for the stored procedure here
	@id int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	select * from UserBaseChatRel ubcr
	where ubcr.ChatId in (
	select ChatId from UserBaseChatRel ubcr2
	where ubcr2.UserBaseId = @id) and ubcr.UserBaseId <>@id

	select UserProfile.UserBaseId as Id, UserProfile.FirstName, UserProfile.LastName, UserProfile.AvatarUrl from userProfile
	where UserBaseId in (
	select ubcr.UserBaseId from UserBaseChatRel ubcr
	where ubcr.ChatId in (
	select ChatId from UserBaseChatRel ubcr2
	where ubcr2.UserBaseId = @id) and ubcr.UserBaseId <> @id)

	select c.ChatId, c.Message from ChatMessage c
	join(select chatId, MAX(sentDate) as Recent from ChatMessage
	group by ChatId) msg on msg.ChatId = c.ChatId and msg.Recent = c.SentDate

	select ChatId, Count(*) Unread from ChatMessage  
	where MessageRead = 0 and ChatId in (select ChatId from UserBaseChatRel ubcr2
	where ubcr2.UserBaseId = @id)
	group by ChatId


END
