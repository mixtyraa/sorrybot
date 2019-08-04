export interface ITokenResonse {
  id: string;
  identifier: string;
  idMember: string;
  dateCreated: string;
  dateExpires: string;
  permissions: Array < {
    idModal: string;
    modelType: string;
    read: boolean;
    write: boolean;
  } > ;
}

export interface IBoard {
  name: string;
  desc: string;
  descData: string;
  closed: boolean;
  idOrganization: string;
  limits: string;
  pinned: string;
  shortLink: string;
  powerUps: [];
  dateLastActivity: string;
  idTags: [];
  datePluginDisable: string;
  creationMethod: string;
  ixUpdate: string;
  id: string;
  starred: boolean;
  url: string;
  prefs: {
    permissionLevel: string;
    hideVotes: boolean;
    voting: string;
    comments: string;
    invitations: string;
    selfJoin: boolean;
    cardCovers: boolean;
    isTemplate: boolean;
    cardAging: string;
    calendarFeedEnabled: boolean;
    background: string;
    backgroundImage: string;
    backgroundImageScaled: Array < {
      width: number;
      height: number;
      url: string;
    } > ,
    backgroundTile: boolean;
    backgroundBrightness: string;
    backgroundBottomColor: string;
    backgroundTopColor: string;
    canBePublic: boolean;
    canBeEnterprise: boolean;
    canBeOrg: boolean;
    canBePrivate: boolean;
    canInvite: boolean;
  };
  subscribed: boolean;
  labelNames: {
    green: string;
    yellow: string;
    orange: string;
    red: string;
    purple: string;
    blue: string;
    sky: string;
    lime: string;
    pink: string;
    black: string;
  };
  dateLastView: string;
  shortUrl: string;
  memberships: [{
    id: string;
    idMember: string;
    memberType: string;
    unconfirmed: boolean;
    deactivated: boolean;
  }];
}

export interface IList {
  id: string;
  name: string;
  closed: boolean;
  idBoard: string;
  pos: number;
  subscribed: boolean;
  softLimit: number;
}

// export interface ICard {
//   id: string;
//   name: string;
//   badges: {
//     votes: number;
//     viewingMemberVoted: boolean;
//     subscribed: boolean;
//     fogbugz: string;
//     checkItems: number;
//     checkItemsChecked: number;
//     comments: number;
//     attachments: number;
//     description: boolean;
//     due: null,
//     dueComplete: boolean;
//   };
//   labels: [
//     {
//       id: string;
//       idBoard: string;
//       name: string;
//       color: string;
//       uses: number
//     }
//   ];
// }

export interface ICard {
  id: string;
  checkItemStates: string;
  closed: boolean;
  dateLastActivity: string;
  desc: string;
  descData: string;
  dueReminder: string;
  idBoard: string;
  idList: string;
  idMembersVoted: number[];
  idShort: number;
  idAttachmentCover: number;
  idLabels: number[];
  manualCoverAttachment: boolean;
  name: string;
  pos: number;
  shortLink: string;
  badges: {
    attachmentsByType: {
      trello: {
        board: number;
        card: number
      }
    },
    location: boolean;
    votes: number;
    viewingMemberVoted: boolean;
    subscribed: boolean;
    fogbugz: string;
    checkItems: number;
    checkItemsChecked: number;
    comments: number;
    attachments: number;
    description: boolean;
    due: string;
    dueComplete: boolean;
  };
  dueComplete: boolean;
  due: string;
  idChecklists: number[];
  idMembers: number[];
  labels: string[];
  shortUrl: string;
  subscribed: boolean;
  url: string;
  attachments: IAttachment[];
}

export interface IAddCardRequest {
  /**
   * The name for the card
   */
  name ?: string;
  /**
   * The description for the card
   */
  desc ?: string;
  /**
   * The position of the new card. top, bottom, or a positive float
   */
  pos ?: string;
  /**
   * A due date for the card
   */
  due ?: string;
  dueComplete ?: boolean;
  /**
   * The ID of the list the card should be created in
   */
  idList: string;
  /**
   * Comma-separated list of member IDs to add to the card
   */
  idMembers ?: string;
  /**
   * Comma-separated list of label IDs to add to the card
   */
  idLabels ?: string;
  /**
   * A URL starting with http:// or https://
   */
  urlSource ?: string;
  fileSource ?: string;
  /**
   * The ID of a card to copy into the new card
   */
  idCardSource ?: string;
  /**
   * If using idCardSource you can specify which properties to copy over. all or comma-separated list of: attachments,checklists,comments,due,labels,members,stickers
   */
  keepFromSource ?: string;
  /**
   * For use with/by the Map Power-Up
   */
  address ?: string;
  /**
   *  For use with/by the Map Power-Up
   */
  locationName ?: string;
  coordinates ?: string;
}

export interface IAttachment {
  id: string;
  bytes: number;
  date: string;
  edgeColor: string;
  idMember: string;
  isUpload: boolean;
  mimeType: string;
  name: string;
  previews: [{
    bytes: number;
    url: string;
    height: number;
    width: number;
    _id: string;
    scaled: boolean;
  }];
  url: string;
  pos: number;
}

export interface IAddWebhookRequest {
  /**
   * A string with a length from 0 to 16384
   */
  description ?: string;
  /**
   * A valid URL that is reachable with a HEAD and POST request.
   */
  callbackURL: string;
  /**
   * ID of the model to be monitored
   */
  idModel: string;
  /**
   * Determines whether the webhook is active and sending POST requests.
   */
  active ?: boolean;
}

export interface IWebhook {
  id: string;
  description: string;
  idModel: string;
  callbackURL: string;
  active: boolean;
}

export interface IAction {
  id: string;
  idMemberCreator: string;
  data: {
    old?: any;
    card: ICard;
    board: IBoard;
    list: IList;
  };
  type: string;
  date: string;
  limits: any;
  display: {
    translationKey: string;
    entities: {
      card: {
        type: string;
        desc: string;
        id: string;
        shortLink: string;
        text: string;
      },
      memberCreator: {
        type: string;
        id: string;
        username: string;
        text: string;
      }
    }
  };
  memberCreator: {
    id: string;
    avatarHash: string;
    avatarUrl: string;
    fullName: string;
    idMemberReferrer: string;
    initials: string;
    nonPublic: any,
    nonPublicAvailable: boolean;
    username: string;
  };
}
