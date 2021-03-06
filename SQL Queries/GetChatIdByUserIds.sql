USE [C56]
GO
/****** Object:  StoredProcedure [dbo].[Chat_GetChatIdByUserIds]    Script Date: 8/26/2018 7:03:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Aaron Chu
-- Create date: 7/7
-- Description:	Update  UserbaseChatRel by Id
/* Test Script
DECLARE	@return_value int

EXEC	@return_value = [dbo].[Chat_GetChatIdByUserIds]
		@user1 = 23,
		@user2 = 54

SELECT	'Return Value' = @return_value
*/
-- =============================================
ALTER PROCEDURE [dbo].[Chat_GetChatIdByUserIds]
	-- Add the parameters for the stored procedure here
	@user1 int,
	@user2 int,
	@chatId int output
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

if(not exists(select chat.Id from Chat
join(select * from UserBaseChatRel where UserBaseId=@user1) t1 on t1.ChatId = chat.Id
join(select * from UserBaseChatRel where UserBaseId=@user2) t2 on t2.ChatId = chat.Id
where t1.ChatId = t2.ChatId))
begin
	exec Chat_Insert @chattitle=null,@id=@chatId output
	EXEC UserBaseChatRel_Insert
		@userBaseId = @user1,
		@chatId = @chatId
	EXEC UserBaseChatRel_Insert
		@userBaseId = @user2,
		@chatId = @chatId
end
else begin
select @chatId = chat.id from Chat
join(select * from UserBaseChatRel where UserBaseId=@user1) t1 on t1.ChatId = chat.Id
join(select * from UserBaseChatRel where UserBaseId=@user2) t2 on t2.ChatId = chat.Id
where t1.ChatId = t2.ChatId
end
	


END
