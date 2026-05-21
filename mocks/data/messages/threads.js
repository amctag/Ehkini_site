/** GET /messages/threads/:contactId — keyed by contact id */
export const mockThreadsByContactId = {
  "contact-sarah": {
    contactId: "contact-sarah",
    messages: [
      {
        id: "msg-1",
        kind: "received",
        text: "Hey! Thanks for connecting 😊",
        time: "10:30 AM"
      },
      {
        id: "msg-2",
        kind: "sent",
        text: "Hi! Nice to meet you!",
        time: "10:32 AM"
      },
      {
        id: "msg-3",
        kind: "sent",
        variant: "gift",
        text: "🌹",
        time: "10:33 AM"
      },
      {
        id: "msg-4",
        kind: "received",
        text: "Thank you for the gift! 💕",
        time: "10:35 AM"
      },
      {
        id: "msg-5",
        kind: "received",
        variant: "compact",
        text: "That's so thoughtful!",
        time: "10:35 AM"
      }
    ]
  },
  "contact-ahmed": {
    contactId: "contact-ahmed",
    messages: [
      {
        id: "msg-a1",
        kind: "received",
        text: "That's so kind of you!",
        time: "9:15 AM"
      }
    ]
  },
  "contact-maya": {
    contactId: "contact-maya",
    messages: [
      {
        id: "msg-m1",
        kind: "received",
        text: "Would love to connect more",
        time: "Yesterday"
      }
    ]
  },
  "contact-omar": {
    contactId: "contact-omar",
    messages: [
      {
        id: "msg-o1",
        kind: "received",
        text: "See you soon!",
        time: "Monday"
      }
    ]
  }
};
