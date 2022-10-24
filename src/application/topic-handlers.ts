import { EventTopicHandler } from "../infra/messaging/handlers/event-topic-handler";
import { UsersCreatedTopicHandler } from "../infra/messaging/handlers/users-created-topic-handler";

export default {
    "events": EventTopicHandler,
    "retry.events": EventTopicHandler,
    "users.created": UsersCreatedTopicHandler,
};