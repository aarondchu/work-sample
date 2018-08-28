
    public interface IChatMessageService
    {
        List<ChatMessage> ReadAll();

        ChatMessage ReadById(int id);

        int Insert(ChatMessageAddRequest model);

        void Update(ChatMessageUpdateRequest model);

        void Delete(int id);
    }
