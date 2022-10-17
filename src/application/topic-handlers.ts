import { EventTopicHandler } from "../infra/messaging/handlers/event-topic-handler";

export default {
    "events": EventTopicHandler,
    "retry.events": EventTopicHandler,
};