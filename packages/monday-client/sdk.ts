import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date. */
  Date: { input: any; output: any; }
  /** A multipart file */
  File: { input: any; output: any; }
  /** An ISO 8601-encoded datetime */
  ISO8601DateTime: { input: any; output: any; }
  /** A JSON formatted string. */
  JSON: { input: any; output: any; }
};

/** Your monday.com account */
export type Account = {
  __typename?: 'Account';
  /** The account's country two-letter code in ISO3166 format */
  country_code?: Maybe<Scalars['String']['output']>;
  /** The first day of the week for the account (sunday / monday) */
  first_day_of_the_week: FirstDayOfTheWeek;
  /** The account's unique identifier. */
  id: Scalars['Int']['output'];
  /** The account's logo. */
  logo?: Maybe<Scalars['String']['output']>;
  /** The account's name. */
  name: Scalars['String']['output'];
  /** The account's payment plan. */
  plan?: Maybe<Plan>;
  /** The account's active products */
  products?: Maybe<Array<Maybe<AccountProduct>>>;
  /** Show weekends in timeline */
  show_timeline_weekends: Scalars['Boolean']['output'];
  /** The product the account signed up to first. */
  sign_up_product_kind?: Maybe<Scalars['String']['output']>;
  /** The account's slug. */
  slug: Scalars['String']['output'];
  /** The account's tier. */
  tier?: Maybe<Scalars['String']['output']>;
};

/** The product a workspace is used in. */
export type AccountProduct = {
  __typename?: 'AccountProduct';
  /** The account product id */
  id?: Maybe<Scalars['Int']['output']>;
  /**
   * The account product kind (core / marketing / crm / software /
   * projectManagement / project_management / forms / whiteboard).
   */
  kind?: Maybe<AccountProductKind>;
};

/** The account product kinds available. */
export enum AccountProductKind {
  /** monday work management */
  CORE = 'core',
  /** monday sales CRM */
  CRM = 'crm',
  /** workforms */
  FORMS = 'forms',
  /** monday marketer */
  MARKETING = 'marketing',
  /** monday projects (Deprecated) */
  PROJECTMANAGEMENT = 'projectManagement',
  /** monday projects */
  PROJECT_MANAGEMENT = 'project_management',
  /** monday dev */
  SOFTWARE = 'software',
  /** canvas */
  WHITEBOARD = 'whiteboard'
}

/** An activity log event */
export type ActivityLogType = {
  __typename?: 'ActivityLogType';
  account_id: Scalars['String']['output'];
  created_at: Scalars['String']['output'];
  /** The item's column values in string form. */
  data: Scalars['String']['output'];
  entity: Scalars['String']['output'];
  event: Scalars['String']['output'];
  id: Scalars['String']['output'];
  user_id: Scalars['String']['output'];
};

/** The app monetization status for the current account */
export type AppMonetizationStatus = {
  __typename?: 'AppMonetizationStatus';
  /** Is apps monetization is supported for the account */
  is_supported: Scalars['Boolean']['output'];
};

/** The account subscription details for the app. */
export type AppSubscription = {
  __typename?: 'AppSubscription';
  /** The type of the billing period [monthly/yearly]. */
  billing_period?: Maybe<Scalars['String']['output']>;
  /** The number of days left until the subscription ends. */
  days_left?: Maybe<Scalars['Int']['output']>;
  /** Is the subscription a trial */
  is_trial?: Maybe<Scalars['Boolean']['output']>;
  /** The subscription plan id (on the app's side). */
  plan_id: Scalars['String']['output'];
  /** The subscription renewal date. */
  renewal_date: Scalars['Date']['output'];
};

/** A file uploaded to monday.com */
export type Asset = {
  __typename?: 'Asset';
  /** The file's creation date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The file's extension. */
  file_extension: Scalars['String']['output'];
  /** The file's size in bytes. */
  file_size: Scalars['Int']['output'];
  /** The file's unique identifier. */
  id: Scalars['ID']['output'];
  /** The file's name. */
  name: Scalars['String']['output'];
  /** original geometry of the asset. */
  original_geometry?: Maybe<Scalars['String']['output']>;
  /** public url to the asset, valid for 1 hour. */
  public_url: Scalars['String']['output'];
  /** The user who uploaded the file. */
  uploaded_by: User;
  /** url to view the asset. */
  url: Scalars['String']['output'];
  /** url to view the asset in thumbnail mode. Only available for images. */
  url_thumbnail?: Maybe<Scalars['String']['output']>;
};

/** The source of the asset */
export enum AssetsSource {
  /** Assets from file columns and item's files gallery */
  ALL = 'all',
  /** Assets only from file columns */
  COLUMNS = 'columns',
  /** Assets only from item's files gallery */
  GALLERY = 'gallery'
}

/** A monday.com board. */
export type Board = {
  __typename?: 'Board';
  /** The board log events. */
  activity_logs?: Maybe<Array<Maybe<ActivityLogType>>>;
  /** The board's folder unique identifier. */
  board_folder_id?: Maybe<Scalars['Int']['output']>;
  /** The board's kind (public / private / share). */
  board_kind: BoardKind;
  /** The board's visible columns. */
  columns?: Maybe<Array<Maybe<Column>>>;
  /** Get the board communication value - typically meeting ID */
  communication?: Maybe<Scalars['JSON']['output']>;
  /** The creator of the board. */
  creator: User;
  /** The board's description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The board's visible groups. */
  groups?: Maybe<Array<Maybe<Group>>>;
  /** The unique identifier of the board. */
  id: Scalars['ID']['output'];
  /** The Board's item nickname, one of a predefined set of values, or a custom user value */
  item_terminology?: Maybe<Scalars['String']['output']>;
  /**
   * The board's items (rows).
   * @deprecated Replaced by Board.items_page in 2023-10
   */
  items?: Maybe<Array<Maybe<Item>>>;
  /** The number of items on the board */
  items_count?: Maybe<Scalars['Int']['output']>;
  /** The board's name. */
  name: Scalars['String']['output'];
  /**
   * The owner of the board.
   * @deprecated This field returned creator of the board. Please use 'creator' or 'owners' fields instead.
   */
  owner: User;
  /** List of user board owners */
  owners: Array<Maybe<User>>;
  /** The board's permissions. */
  permissions: Scalars['String']['output'];
  /**
   * The board's position.
   * @deprecated pos is no longer supported and returns invalid value
   */
  pos?: Maybe<Scalars['String']['output']>;
  /** The board's state (all / active / archived / deleted). */
  state: State;
  /** The board's subscribers. */
  subscribers: Array<Maybe<User>>;
  /** The board's specific tags. */
  tags?: Maybe<Array<Maybe<Tag>>>;
  /** List of team board owners */
  team_owners?: Maybe<Array<Team>>;
  /** The top group at this board. */
  top_group: Group;
  /** The board object type. */
  type?: Maybe<BoardObjectType>;
  /** The last time the board was updated at. */
  updated_at?: Maybe<Scalars['ISO8601DateTime']['output']>;
  /** The board's updates. */
  updates?: Maybe<Array<Maybe<Update>>>;
  /** The board's views. */
  views?: Maybe<Array<Maybe<BoardView>>>;
  /** The workspace that contains this board (null for main workspace). */
  workspace?: Maybe<Workspace>;
  /** The board's workspace unique identifier (null for main workspace). */
  workspace_id?: Maybe<Scalars['Int']['output']>;
};


/** A monday.com board. */
export type BoardActivity_LogsArgs = {
  column_ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from?: InputMaybe<Scalars['ISO8601DateTime']['input']>;
  group_ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  item_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['ISO8601DateTime']['input']>;
  user_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};


/** A monday.com board. */
export type BoardColumnsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  types?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** A monday.com board. */
export type BoardGroupsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** A monday.com board. */
export type BoardItemsArgs = {
  exclude_nonactive?: InputMaybe<Scalars['Boolean']['input']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  newest_first?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** A monday.com board. */
export type BoardTeam_OwnersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** A monday.com board. */
export type BoardUpdatesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** A monday.com board. */
export type BoardViewsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** The board attributes available. */
export enum BoardAttributes {
  /** Object that contains available Video conferences on the board. */
  COMMUNICATION = 'communication',
  /** Board description. */
  DESCRIPTION = 'description',
  /** Board name. */
  NAME = 'name'
}

/** A board duplication */
export type BoardDuplication = {
  __typename?: 'BoardDuplication';
  /** The new board created by the duplication */
  board: Board;
  /** Was the board duplication performed asynchronously */
  is_async: Scalars['Boolean']['output'];
};

/** The board kinds available. */
export enum BoardKind {
  /** Private boards. */
  PRIVATE = 'private',
  /** Public boards. */
  PUBLIC = 'public',
  /** Shareable boards. */
  SHARE = 'share'
}

/** The board object types. */
export enum BoardObjectType {
  /** Parent Board. */
  BOARD = 'board',
  /** Custom Object. */
  CUSTOM_OBJECT = 'custom_object',
  /** Document. */
  DOCUMENT = 'document',
  /** Sub Items Board. */
  SUB_ITEMS_BOARD = 'sub_items_board'
}

/** The board subscriber kind. */
export enum BoardSubscriberKind {
  /** Board owner. */
  OWNER = 'owner',
  /** Board subscriber. */
  SUBSCRIBER = 'subscriber'
}

/** A board's view. */
export type BoardView = {
  __typename?: 'BoardView';
  /** The view's unique identifier. */
  id: Scalars['ID']['output'];
  /** The view's name. */
  name: Scalars['String']['output'];
  /** The view's settings in a string form. */
  settings_str: Scalars['String']['output'];
  /** The view's type. */
  type: Scalars['String']['output'];
  /** Specific board view data (supported only for forms) */
  view_specific_data_str: Scalars['String']['output'];
};

/** Options to order by. */
export enum BoardsOrderBy {
  /** The rank order of the board creation time (desc). */
  CREATED_AT = 'created_at',
  /** The last time the user making the request used the board (desc). */
  USED_AT = 'used_at'
}

export type Column = {
  __typename?: 'Column';
  /** Is the column archived or not. */
  archived: Scalars['Boolean']['output'];
  /** The column's description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /**
   * The column's position in the board.
   * @deprecated The field will always return null. Columns are sorted by position by default.
   */
  pos?: Maybe<Scalars['String']['output']>;
  /** The column's settings in a string form. */
  settings_str: Scalars['String']['output'];
  /** The column's title. */
  title: Scalars['String']['output'];
  /** The column's type. */
  type: Scalars['String']['output'];
  /** The column's width. */
  width?: Maybe<Scalars['Int']['output']>;
};

/** The property name of the column to be changed. */
export enum ColumnProperty {
  /** the column description. */
  DESCRIPTION = 'description',
  /** the column title. */
  TITLE = 'title'
}

/** The columns to create. */
export enum ColumnType {
  /** Number items according to their order in the group/board */
  AUTO_NUMBER = 'auto_number',
  /** Connect data from other boards */
  BOARD_RELATION = 'board_relation',
  /** Perform actions on items by clicking a button */
  BUTTON = 'button',
  /** Check off items and see what's done at a glance */
  CHECKBOX = 'checkbox',
  /** Manage a design system using a color palette */
  COLOR_PICKER = 'color_picker',
  /** Choose a country */
  COUNTRY = 'country',
  /** Add the item's creator and creation date automatically */
  CREATION_LOG = 'creation_log',
  /** Add dates like deadlines to ensure you never drop the ball */
  DATE = 'date',
  /** Set up dependencies between items in the board */
  DEPENDENCY = 'dependency',
  /** Instantly add collaborative rich text editor */
  DOC = 'doc',
  /** Create a dropdown list of options */
  DROPDOWN = 'dropdown',
  /** Email team members and clients directly from your board */
  EMAIL = 'email',
  /** Add files & docs to your item */
  FILE = 'file',
  /** Use functions to manipulate data across multiple columns */
  FORMULA = 'formula',
  /** Add times to manage and schedule tasks, shifts and more */
  HOUR = 'hour',
  /** Integration is really cool... */
  INTEGRATION = 'integration',
  /** Show all item's assignees */
  ITEM_ASSIGNEES = 'item_assignees',
  /** Show a unique ID for each item */
  ITEM_ID = 'item_id',
  /** Add the person that last updated the item and the date */
  LAST_UPDATED = 'last_updated',
  /** Simply hyperlink to any website */
  LINK = 'link',
  /** Place multiple locations on a geographic map */
  LOCATION = 'location',
  /** Add large amounts of text without changing column width */
  LONG_TEXT = 'long_text',
  /** Show and edit columns' data from connected boards */
  MIRROR = 'mirror',
  /** Name is really cool... */
  NAME = 'name',
  /** Add revenue, costs, time estimations and more */
  NUMBERS = 'numbers',
  /** Assign people to improve team work */
  PEOPLE = 'people',
  /** Call your contacts directly from monday.com */
  PHONE = 'phone',
  /** Show progress by combining status columns in a battery */
  PROGRESS = 'progress',
  /** Rate or rank anything visually */
  RATING = 'rating',
  /** Get an instant overview of where things stand */
  STATUS = 'status',
  /** Use the subtasks column to create another level of tasks */
  SUBTASKS = 'subtasks',
  /** Add tags to categorize items across multiple boards */
  TAGS = 'tags',
  /** Assign a full team to an item  */
  TEAM = 'team',
  /** Add textual information e.g. addresses, names or keywords */
  TEXT = 'text',
  /** Easily track time spent on each item, group, and board */
  TIME_TRACKING = 'time_tracking',
  /** Visualize your item’s duration, with a start and end date */
  TIMELINE = 'timeline',
  /** Unsupported column type */
  UNSUPPORTED = 'unsupported',
  /** Vote on an item e.g. pick a new feature or a favorite lunch place */
  VOTE = 'vote',
  /** Select the week on which each item should be completed */
  WEEK = 'week',
  /** Keep track of the time anywhere in the world */
  WORLD_CLOCK = 'world_clock'
}

/** The value of an items column */
export type ColumnValue = {
  __typename?: 'ColumnValue';
  /** The column value's additional information. */
  additional_info?: Maybe<Scalars['JSON']['output']>;
  /** The column's description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** The column's textual value in string form. */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's title. */
  title: Scalars['String']['output'];
  /** The column's type. */
  type: Scalars['String']['output'];
  /** The column's value in json format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** Complexity data. */
export type Complexity = {
  __typename?: 'Complexity';
  /** The remainder of complexity after the query's execution. */
  after: Scalars['Int']['output'];
  /** The remainder of complexity before the query's execution. */
  before: Scalars['Int']['output'];
  /** The specific query's complexity. */
  query: Scalars['Int']['output'];
  /** How long in seconds before the complexity budget is reset */
  reset_in_x_seconds: Scalars['Int']['output'];
};

export type CreateDocBoardInput = {
  /** Column id */
  column_id: Scalars['String']['input'];
  /** Item id */
  item_id: Scalars['ID']['input'];
};

export type CreateDocInput = {
  board?: InputMaybe<CreateDocBoardInput>;
};

/** Various documents blocks types, such as text. */
export enum DocBlockContentType {
  /** Bulleted list block */
  BULLETED_LIST = 'bulleted_list',
  /** Check list block */
  CHECK_LIST = 'check_list',
  /** Code block */
  CODE = 'code',
  /** Divider block */
  DIVIDER = 'divider',
  /** Image block */
  IMAGE = 'image',
  /** Large title block */
  LARGE_TITLE = 'large_title',
  /** Layout block */
  LAYOUT = 'layout',
  /** Medium title block */
  MEDIUM_TITLE = 'medium_title',
  /** Simple text block */
  NORMAL_TEXT = 'normal_text',
  /** Notice block */
  NOTICE_BOX = 'notice_box',
  /** Numbered list block */
  NUMBERED_LIST = 'numbered_list',
  /** Quote text block */
  QUOTE = 'quote',
  /** Small title block */
  SMALL_TITLE = 'small_title',
  /** Table block */
  TABLE = 'table',
  /** Video block */
  VIDEO = 'video'
}

/** Options to order by. */
export enum DocsOrderBy {
  /** The rank order of the document creation time (desc). */
  CREATED_AT = 'created_at',
  /** The last time the user making the request viewd the document (desc). */
  USED_AT = 'used_at'
}

/** A monday.com document. */
export type Document = {
  __typename?: 'Document';
  /** The document's content blocks */
  blocks?: Maybe<Array<Maybe<DocumentBlock>>>;
  /** The document's creation date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The document's creator */
  created_by?: Maybe<User>;
  /** The document's folder unique identifier (null for first level). */
  doc_folder_id?: Maybe<Scalars['Int']['output']>;
  /** The document's kind (public / private / share). */
  doc_kind: BoardKind;
  /** The document's unique identifier. */
  id: Scalars['Int']['output'];
  /** The document's name. */
  name: Scalars['String']['output'];
  /** The associated board or object's unique identifier. */
  object_id: Scalars['Int']['output'];
  /** The document's relative url */
  relative_url?: Maybe<Scalars['String']['output']>;
  /** The document's settings. */
  settings?: Maybe<Scalars['JSON']['output']>;
  /** The document's direct url */
  url?: Maybe<Scalars['String']['output']>;
  /** The workspace that contains this document (null for main workspace). */
  workspace?: Maybe<Workspace>;
  /** The document's workspace unique identifier (null for main workspace). */
  workspace_id?: Maybe<Scalars['Int']['output']>;
};


/** A monday.com document. */
export type DocumentBlocksArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** A monday.com document block. */
export type DocumentBlock = {
  __typename?: 'DocumentBlock';
  /** The block's content. */
  content?: Maybe<Scalars['JSON']['output']>;
  /** The block's creation date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The block's creator */
  created_by?: Maybe<User>;
  /** The block's document unique identifier. */
  doc_id?: Maybe<Scalars['Int']['output']>;
  /** The block's unique identifier. */
  id: Scalars['String']['output'];
  /** The block's parent block unique identifier. */
  parent_block_id?: Maybe<Scalars['String']['output']>;
  /** The block's position on the document. */
  position?: Maybe<Scalars['Float']['output']>;
  /** The block content type. */
  type?: Maybe<Scalars['String']['output']>;
  /** The block's last updated date. */
  updated_at?: Maybe<Scalars['Date']['output']>;
};

/** A monday.com doc block. */
export type DocumentBlockIdOnly = {
  __typename?: 'DocumentBlockIdOnly';
  /** The block's unique identifier. */
  id: Scalars['String']['output'];
};

/** The board duplicate types available. */
export enum DuplicateBoardType {
  /** Duplicate board with structure and items. */
  DUPLICATE_BOARD_WITH_PULSES = 'duplicate_board_with_pulses',
  /** Duplicate board with structure, items and updates. */
  DUPLICATE_BOARD_WITH_PULSES_AND_UPDATES = 'duplicate_board_with_pulses_and_updates',
  /** Duplicate board with structure. */
  DUPLICATE_BOARD_WITH_STRUCTURE = 'duplicate_board_with_structure'
}

/** The first day of work week */
export enum FirstDayOfTheWeek {
  /** Monday */
  MONDAY = 'monday',
  /** Sunday */
  SUNDAY = 'sunday'
}

/** A workspace folder containing boards, docs, sub folders, etc. */
export type Folder = {
  __typename?: 'Folder';
  /** The various items in the folder, not including sub-folders and dashboards. */
  children: Array<Maybe<Board>>;
  /** The folder's color. */
  color?: Maybe<FolderColor>;
  /** The folder's creation date. */
  created_at: Scalars['Date']['output'];
  /** The folder's unique identifier. */
  id: Scalars['Int']['output'];
  /** The folder's name. */
  name: Scalars['String']['output'];
  /** The folder's user owner unique identifier. */
  owner_id?: Maybe<Scalars['Int']['output']>;
  /** The folder's parent folder. */
  parent?: Maybe<Folder>;
  /** Sub-folders inside this folder. */
  sub_folders: Array<Maybe<Folder>>;
  /** The workspace that contains this folder (null id for main workspace). */
  workspace: Workspace;
};

/** One value out of a list of valid folder colors */
export enum FolderColor {
  /** aquamarine */
  AQUAMARINE = 'AQUAMARINE',
  /** bright-blue */
  BRIGHT_BLUE = 'BRIGHT_BLUE',
  /** bright-green */
  BRIGHT_GREEN = 'BRIGHT_GREEN',
  /** chili-blue */
  CHILI_BLUE = 'CHILI_BLUE',
  /** dark-orange */
  DARK_ORANGE = 'DARK_ORANGE',
  /** dark_purple */
  DARK_PURPLE = 'DARK_PURPLE',
  /** dark-red */
  DARK_RED = 'DARK_RED',
  /** done-green */
  DONE_GREEN = 'DONE_GREEN',
  /** indigo */
  INDIGO = 'INDIGO',
  /** lipstick */
  LIPSTICK = 'LIPSTICK',
  /** No color */
  NULL = 'NULL',
  /** purple */
  PURPLE = 'PURPLE',
  /** sofia_pink */
  SOFIA_PINK = 'SOFIA_PINK',
  /** stuck-red */
  STUCK_RED = 'STUCK_RED',
  /** sunset */
  SUNSET = 'SUNSET',
  /** working_orange */
  WORKING_ORANGE = 'WORKING_ORANGE'
}

/** A group of items in a board. */
export type Group = {
  __typename?: 'Group';
  /** Is the group archived or not. */
  archived?: Maybe<Scalars['Boolean']['output']>;
  /** The group's color. */
  color: Scalars['String']['output'];
  /** Is the group deleted or not. */
  deleted?: Maybe<Scalars['Boolean']['output']>;
  /** The group's unique identifier. */
  id: Scalars['ID']['output'];
  /** The items in the group. */
  items?: Maybe<Array<Maybe<Item>>>;
  /** The group's position in the board. */
  position: Scalars['String']['output'];
  /** The group's title. */
  title: Scalars['String']['output'];
};


/** A group of items in a board. */
export type GroupItemsArgs = {
  exclude_nonactive?: InputMaybe<Scalars['Boolean']['input']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  newest_first?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** The group attributes available. */
export enum GroupAttributes {
  /** Group color (one of the supported colors, check the API documentation). */
  COLOR = 'color',
  /** The group's position in the board. Deprecated! - replaced with relative position */
  POSITION = 'position',
  /** The group's relative position after another group in the board. */
  RELATIVE_POSITION_AFTER = 'relative_position_after',
  /** The group's relative position before another group in the board. */
  RELATIVE_POSITION_BEFORE = 'relative_position_before',
  /** Group title. */
  TITLE = 'title'
}

/** An item (table row). */
export type Item = {
  __typename?: 'Item';
  /** The item's assets/files. */
  assets?: Maybe<Array<Maybe<Asset>>>;
  /** The board that contains this item. */
  board?: Maybe<Board>;
  /** The item's column values. */
  column_values?: Maybe<Array<Maybe<ColumnValue>>>;
  /** The item's create date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The item's creator. */
  creator?: Maybe<User>;
  /** The unique identifier of the item creator. */
  creator_id: Scalars['String']['output'];
  /** The item's email. */
  email: Scalars['String']['output'];
  /** The group that contains this item. */
  group?: Maybe<Group>;
  /** The item's unique identifier. */
  id: Scalars['ID']['output'];
  /** The item's name. */
  name: Scalars['String']['output'];
  /** The parent item of a subitem. */
  parent_item?: Maybe<Item>;
  /** The item's relative path */
  relative_link?: Maybe<Scalars['String']['output']>;
  /** The item's state (all / active / archived / deleted). */
  state?: Maybe<State>;
  /** The item's subitems. */
  subitems?: Maybe<Array<Maybe<Item>>>;
  /** The pulses's subscribers. */
  subscribers: Array<Maybe<User>>;
  /** The item's last update date. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The item's updates. */
  updates?: Maybe<Array<Maybe<Update>>>;
};


/** An item (table row). */
export type ItemAssetsArgs = {
  assets_source?: InputMaybe<AssetsSource>;
  column_ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** An item (table row). */
export type ItemColumn_ValuesArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** An item (table row). */
export type ItemUpdatesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** Update your monday.com data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Add a file to a column value. */
  add_file_to_column?: Maybe<Asset>;
  /** Add a file to an update. */
  add_file_to_update?: Maybe<Asset>;
  /**
   * Add subscribers to a board.
   * @deprecated use add_users_to_board instead
   */
  add_subscribers_to_board?: Maybe<Array<Maybe<User>>>;
  /** Add teams subscribers to a board. */
  add_teams_to_board?: Maybe<Array<Maybe<Team>>>;
  /** Add teams to a workspace. */
  add_teams_to_workspace?: Maybe<Array<Maybe<Team>>>;
  /** Add subscribers to a board. */
  add_users_to_board?: Maybe<Array<Maybe<User>>>;
  /** Add users to a workspace. */
  add_users_to_workspace?: Maybe<Array<Maybe<User>>>;
  /** Archive a board. */
  archive_board?: Maybe<Board>;
  /** Archives a group in a specific board. */
  archive_group?: Maybe<Group>;
  /** Archive an item. */
  archive_item?: Maybe<Item>;
  /** Change a column's properties */
  change_column_metadata?: Maybe<Column>;
  /** Change a column's title */
  change_column_title?: Maybe<Column>;
  /** Change an item's column value. */
  change_column_value?: Maybe<Item>;
  /** Changes the column values of a specific item. */
  change_multiple_column_values?: Maybe<Item>;
  /** Change an item's column with simple value. */
  change_simple_column_value?: Maybe<Item>;
  /** Clear an item's updates. */
  clear_item_updates?: Maybe<Item>;
  /** Get the complexity data of your mutations. */
  complexity?: Maybe<Complexity>;
  /** Create a new board. */
  create_board?: Maybe<Board>;
  /** Create a new column in board. */
  create_column?: Maybe<Column>;
  /** Create a new doc. */
  create_doc?: Maybe<Document>;
  /** Create new document block */
  create_doc_block?: Maybe<DocumentBlock>;
  /** Creates a folder in a specific workspace. */
  create_folder?: Maybe<Folder>;
  /** Creates a new group in a specific board. */
  create_group?: Maybe<Group>;
  /** Create a new item. */
  create_item?: Maybe<Item>;
  /** Create a new notification. */
  create_notification?: Maybe<Notification>;
  /** Create a new tag or get it if it already exists. */
  create_or_get_tag?: Maybe<Tag>;
  /** Create subitem. */
  create_subitem?: Maybe<Item>;
  /** Create a new update. */
  create_update?: Maybe<Update>;
  /** Create a new webhook. */
  create_webhook?: Maybe<Webhook>;
  /** Create a new workspace. */
  create_workspace?: Maybe<Workspace>;
  /** Delete a board. */
  delete_board?: Maybe<Board>;
  /** Delete a column. */
  delete_column?: Maybe<Column>;
  /** Delete a document block */
  delete_doc_block?: Maybe<DocumentBlockIdOnly>;
  /** Deletes a folder in a specific workspace. */
  delete_folder?: Maybe<Folder>;
  /** Deletes a group in a specific board. */
  delete_group?: Maybe<Group>;
  /** Delete an item. */
  delete_item?: Maybe<Item>;
  /** Remove subscribers from the board. */
  delete_subscribers_from_board?: Maybe<Array<Maybe<User>>>;
  /** Delete teams from a workspace. */
  delete_teams_from_workspace?: Maybe<Array<Maybe<Team>>>;
  /** Delete an update. */
  delete_update?: Maybe<Update>;
  /** Delete users from a workspace. */
  delete_users_from_workspace?: Maybe<Array<Maybe<User>>>;
  /** Delete a new webhook. */
  delete_webhook?: Maybe<Webhook>;
  /** Delete workspace. */
  delete_workspace?: Maybe<Workspace>;
  /** Duplicate a board. */
  duplicate_board?: Maybe<BoardDuplication>;
  /** Duplicate a group. */
  duplicate_group?: Maybe<Group>;
  /** Duplicate an item. */
  duplicate_item?: Maybe<Item>;
  /** Like an update. */
  like_update?: Maybe<Update>;
  /** Move an item to a different group. */
  move_item_to_group?: Maybe<Item>;
  /** Remove mock app subscription for the current account */
  remove_mock_app_subscription?: Maybe<AppSubscription>;
  /** Set mock app subscription for the current account */
  set_mock_app_subscription?: Maybe<AppSubscription>;
  /** Update Board attribute. */
  update_board?: Maybe<Scalars['JSON']['output']>;
  /** Update a document block */
  update_doc_block?: Maybe<DocumentBlock>;
  /** Updates a folder. */
  update_folder?: Maybe<Folder>;
  /** Update an existing group. */
  update_group?: Maybe<Group>;
};


/** Update your monday.com data. */
export type MutationAdd_File_To_ColumnArgs = {
  column_id: Scalars['String']['input'];
  file: Scalars['File']['input'];
  item_id: Scalars['Int']['input'];
};


/** Update your monday.com data. */
export type MutationAdd_File_To_UpdateArgs = {
  file: Scalars['File']['input'];
  update_id: Scalars['Int']['input'];
};


/** Update your monday.com data. */
export type MutationAdd_Subscribers_To_BoardArgs = {
  board_id: Scalars['Int']['input'];
  kind?: InputMaybe<BoardSubscriberKind>;
  user_ids: Array<InputMaybe<Scalars['Int']['input']>>;
};


/** Update your monday.com data. */
export type MutationAdd_Teams_To_BoardArgs = {
  board_id: Scalars['Int']['input'];
  team_ids: Array<InputMaybe<Scalars['Int']['input']>>;
};


/** Update your monday.com data. */
export type MutationAdd_Teams_To_WorkspaceArgs = {
  kind?: InputMaybe<WorkspaceSubscriberKind>;
  team_ids: Array<InputMaybe<Scalars['Int']['input']>>;
  workspace_id: Scalars['Int']['input'];
};


/** Update your monday.com data. */
export type MutationAdd_Users_To_BoardArgs = {
  board_id: Scalars['Int']['input'];
  kind?: InputMaybe<BoardSubscriberKind>;
  user_ids: Array<InputMaybe<Scalars['Int']['input']>>;
};


/** Update your monday.com data. */
export type MutationAdd_Users_To_WorkspaceArgs = {
  kind?: InputMaybe<WorkspaceSubscriberKind>;
  user_ids: Array<InputMaybe<Scalars['Int']['input']>>;
  workspace_id: Scalars['Int']['input'];
};


/** Update your monday.com data. */
export type MutationArchive_BoardArgs = {
  board_id: Scalars['Int']['input'];
};


/** Update your monday.com data. */
export type MutationArchive_GroupArgs = {
  board_id: Scalars['Int']['input'];
  group_id: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationArchive_ItemArgs = {
  item_id?: InputMaybe<Scalars['Int']['input']>;
};


/** Update your monday.com data. */
export type MutationChange_Column_MetadataArgs = {
  board_id: Scalars['Int']['input'];
  column_id: Scalars['String']['input'];
  column_property?: InputMaybe<ColumnProperty>;
  value?: InputMaybe<Scalars['String']['input']>;
};


/** Update your monday.com data. */
export type MutationChange_Column_TitleArgs = {
  board_id: Scalars['Int']['input'];
  column_id: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationChange_Column_ValueArgs = {
  board_id: Scalars['Int']['input'];
  column_id: Scalars['String']['input'];
  create_labels_if_missing?: InputMaybe<Scalars['Boolean']['input']>;
  item_id?: InputMaybe<Scalars['Int']['input']>;
  value: Scalars['JSON']['input'];
};


/** Update your monday.com data. */
export type MutationChange_Multiple_Column_ValuesArgs = {
  board_id: Scalars['Int']['input'];
  column_values: Scalars['JSON']['input'];
  create_labels_if_missing?: InputMaybe<Scalars['Boolean']['input']>;
  item_id?: InputMaybe<Scalars['Int']['input']>;
};


/** Update your monday.com data. */
export type MutationChange_Simple_Column_ValueArgs = {
  board_id: Scalars['Int']['input'];
  column_id: Scalars['String']['input'];
  create_labels_if_missing?: InputMaybe<Scalars['Boolean']['input']>;
  item_id?: InputMaybe<Scalars['Int']['input']>;
  value: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationClear_Item_UpdatesArgs = {
  item_id: Scalars['Int']['input'];
};


/** Update your monday.com data. */
export type MutationCreate_BoardArgs = {
  board_kind: BoardKind;
  board_name: Scalars['String']['input'];
  board_owner_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  board_owner_team_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  board_subscriber_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  board_subscriber_teams_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  folder_id?: InputMaybe<Scalars['Int']['input']>;
  template_id?: InputMaybe<Scalars['Int']['input']>;
  workspace_id?: InputMaybe<Scalars['Int']['input']>;
};


/** Update your monday.com data. */
export type MutationCreate_ColumnArgs = {
  board_id: Scalars['Int']['input'];
  column_type?: InputMaybe<ColumnType>;
  defaults?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationCreate_DocArgs = {
  location: CreateDocInput;
};


/** Update your monday.com data. */
export type MutationCreate_Doc_BlockArgs = {
  after_block_id?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['JSON']['input'];
  doc_id: Scalars['Int']['input'];
  parent_block_id?: InputMaybe<Scalars['String']['input']>;
  type: DocBlockContentType;
};


/** Update your monday.com data. */
export type MutationCreate_FolderArgs = {
  color?: InputMaybe<FolderColor>;
  name: Scalars['String']['input'];
  parent_folder_id?: InputMaybe<Scalars['Int']['input']>;
  workspace_id?: InputMaybe<Scalars['Int']['input']>;
};


/** Update your monday.com data. */
export type MutationCreate_GroupArgs = {
  board_id: Scalars['Int']['input'];
  group_name: Scalars['String']['input'];
  position?: InputMaybe<Scalars['String']['input']>;
  position_relative_method?: InputMaybe<PositionRelative>;
  relative_to?: InputMaybe<Scalars['String']['input']>;
};


/** Update your monday.com data. */
export type MutationCreate_ItemArgs = {
  board_id: Scalars['Int']['input'];
  column_values?: InputMaybe<Scalars['JSON']['input']>;
  create_labels_if_missing?: InputMaybe<Scalars['Boolean']['input']>;
  group_id?: InputMaybe<Scalars['String']['input']>;
  item_name?: InputMaybe<Scalars['String']['input']>;
};


/** Update your monday.com data. */
export type MutationCreate_NotificationArgs = {
  target_id: Scalars['Int']['input'];
  target_type: NotificationTargetType;
  text: Scalars['String']['input'];
  user_id: Scalars['Int']['input'];
};


/** Update your monday.com data. */
export type MutationCreate_Or_Get_TagArgs = {
  board_id?: InputMaybe<Scalars['Int']['input']>;
  tag_name?: InputMaybe<Scalars['String']['input']>;
};


/** Update your monday.com data. */
export type MutationCreate_SubitemArgs = {
  column_values?: InputMaybe<Scalars['JSON']['input']>;
  create_labels_if_missing?: InputMaybe<Scalars['Boolean']['input']>;
  item_name: Scalars['String']['input'];
  parent_item_id: Scalars['Int']['input'];
};


/** Update your monday.com data. */
export type MutationCreate_UpdateArgs = {
  body: Scalars['String']['input'];
  item_id?: InputMaybe<Scalars['Int']['input']>;
  parent_id?: InputMaybe<Scalars['Int']['input']>;
};


/** Update your monday.com data. */
export type MutationCreate_WebhookArgs = {
  board_id: Scalars['Int']['input'];
  config?: InputMaybe<Scalars['JSON']['input']>;
  event: WebhookEventType;
  url: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationCreate_WorkspaceArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  kind: WorkspaceKind;
  name: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_BoardArgs = {
  board_id: Scalars['Int']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_ColumnArgs = {
  board_id: Scalars['Int']['input'];
  column_id: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_Doc_BlockArgs = {
  block_id: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_FolderArgs = {
  folder_id: Scalars['Int']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_GroupArgs = {
  board_id: Scalars['Int']['input'];
  group_id: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_ItemArgs = {
  item_id?: InputMaybe<Scalars['Int']['input']>;
};


/** Update your monday.com data. */
export type MutationDelete_Subscribers_From_BoardArgs = {
  board_id: Scalars['Int']['input'];
  user_ids: Array<InputMaybe<Scalars['Int']['input']>>;
};


/** Update your monday.com data. */
export type MutationDelete_Teams_From_WorkspaceArgs = {
  team_ids: Array<InputMaybe<Scalars['Int']['input']>>;
  workspace_id: Scalars['Int']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_UpdateArgs = {
  id: Scalars['Int']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_Users_From_WorkspaceArgs = {
  user_ids: Array<InputMaybe<Scalars['Int']['input']>>;
  workspace_id: Scalars['Int']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_WebhookArgs = {
  id: Scalars['Int']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_WorkspaceArgs = {
  workspace_id: Scalars['Int']['input'];
};


/** Update your monday.com data. */
export type MutationDuplicate_BoardArgs = {
  board_id: Scalars['Int']['input'];
  board_name?: InputMaybe<Scalars['String']['input']>;
  duplicate_type: DuplicateBoardType;
  folder_id?: InputMaybe<Scalars['Int']['input']>;
  keep_subscribers?: InputMaybe<Scalars['Boolean']['input']>;
  workspace_id?: InputMaybe<Scalars['Int']['input']>;
};


/** Update your monday.com data. */
export type MutationDuplicate_GroupArgs = {
  add_to_top?: InputMaybe<Scalars['Boolean']['input']>;
  board_id: Scalars['Int']['input'];
  group_id: Scalars['String']['input'];
  group_title?: InputMaybe<Scalars['String']['input']>;
};


/** Update your monday.com data. */
export type MutationDuplicate_ItemArgs = {
  board_id: Scalars['Int']['input'];
  item_id?: InputMaybe<Scalars['Int']['input']>;
  with_updates?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Update your monday.com data. */
export type MutationLike_UpdateArgs = {
  update_id?: InputMaybe<Scalars['Int']['input']>;
};


/** Update your monday.com data. */
export type MutationMove_Item_To_GroupArgs = {
  group_id: Scalars['String']['input'];
  item_id?: InputMaybe<Scalars['Int']['input']>;
};


/** Update your monday.com data. */
export type MutationRemove_Mock_App_SubscriptionArgs = {
  app_id: Scalars['Int']['input'];
  partial_signing_secret: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationSet_Mock_App_SubscriptionArgs = {
  app_id: Scalars['Int']['input'];
  billing_period?: InputMaybe<Scalars['String']['input']>;
  is_trial?: InputMaybe<Scalars['Boolean']['input']>;
  partial_signing_secret: Scalars['String']['input'];
  plan_id?: InputMaybe<Scalars['String']['input']>;
  pricing_version?: InputMaybe<Scalars['Int']['input']>;
  renewal_date?: InputMaybe<Scalars['Date']['input']>;
};


/** Update your monday.com data. */
export type MutationUpdate_BoardArgs = {
  board_attribute: BoardAttributes;
  board_id: Scalars['Int']['input'];
  new_value: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationUpdate_Doc_BlockArgs = {
  block_id: Scalars['String']['input'];
  content: Scalars['JSON']['input'];
};


/** Update your monday.com data. */
export type MutationUpdate_FolderArgs = {
  color?: InputMaybe<FolderColor>;
  folder_id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  parent_folder_id?: InputMaybe<Scalars['Int']['input']>;
};


/** Update your monday.com data. */
export type MutationUpdate_GroupArgs = {
  board_id: Scalars['Int']['input'];
  group_attribute: GroupAttributes;
  group_id: Scalars['String']['input'];
  new_value: Scalars['String']['input'];
};

/** A notification. */
export type Notification = {
  __typename?: 'Notification';
  /** The notification's unique identifier. */
  id: Scalars['ID']['output'];
  /** The notification text. */
  text?: Maybe<Scalars['String']['output']>;
};

/** The notification's target type. */
export enum NotificationTargetType {
  /** Update */
  POST = 'Post',
  /** Item or Board. */
  PROJECT = 'Project'
}

/** The working status of a user. */
export type OutOfOffice = {
  __typename?: 'OutOfOffice';
  /** Is the status active? */
  active?: Maybe<Scalars['Boolean']['output']>;
  /** Are notification disabled? */
  disable_notifications?: Maybe<Scalars['Boolean']['output']>;
  /** The status end date. */
  end_date?: Maybe<Scalars['Date']['output']>;
  /** The status start date. */
  start_date?: Maybe<Scalars['Date']['output']>;
  /** Out of office type. */
  type?: Maybe<Scalars['String']['output']>;
};

/** A payment plan. */
export type Plan = {
  __typename?: 'Plan';
  /** The maximum users allowed in the plan. */
  max_users: Scalars['Int']['output'];
  /** The plan's time period. */
  period?: Maybe<Scalars['String']['output']>;
  /** The plan's tier. */
  tier?: Maybe<Scalars['String']['output']>;
  /** The plan's versoin. */
  version: Scalars['Int']['output'];
};

/** The position relative method. */
export enum PositionRelative {
  /** position after at the given entity. */
  AFTER_AT = 'after_at',
  /** position before at the given entity. */
  BEFORE_AT = 'before_at'
}

/** Get your data from monday.com */
export type Query = {
  __typename?: 'Query';
  /** Get the connected account's information. */
  account?: Maybe<Account>;
  /** Get the current app subscription. Note: This query does not work in the playground */
  app_subscription?: Maybe<Array<Maybe<AppSubscription>>>;
  /** Get apps monetization status for an account */
  apps_monetization_status?: Maybe<AppMonetizationStatus>;
  /** Get a collection of assets by ids. */
  assets?: Maybe<Array<Maybe<Asset>>>;
  /** Get a collection of boards. */
  boards?: Maybe<Array<Maybe<Board>>>;
  /** Get the complexity data of your queries. */
  complexity?: Maybe<Complexity>;
  /** Get a collection of docs. */
  docs?: Maybe<Array<Maybe<Document>>>;
  /** Get a collection of folders. Note: This query won't return folders from closed workspaces to which you are not subscribed */
  folders?: Maybe<Array<Maybe<Folder>>>;
  /** Get a collection of items. */
  items?: Maybe<Array<Maybe<Item>>>;
  /**
   * Search items by their column values.
   * @deprecated Replaced by Query.items_page_by_column_values since 2023-10
   */
  items_by_column_values?: Maybe<Array<Maybe<Item>>>;
  /**
   * Search items by multiple column values.
   * @deprecated Replaced by Query.items_page_by_column_values since 2023-10
   */
  items_by_multiple_column_values?: Maybe<Array<Maybe<Item>>>;
  /** Get the connected user's information. */
  me?: Maybe<User>;
  /** Get a collection of tags. */
  tags?: Maybe<Array<Maybe<Tag>>>;
  /** Get a collection of teams. */
  teams?: Maybe<Array<Maybe<Team>>>;
  /** Get a collection of updates. */
  updates?: Maybe<Array<Maybe<Update>>>;
  /** Get a collection of users. */
  users?: Maybe<Array<Maybe<User>>>;
  /** Get the API version in use */
  version: Version;
  /** Get a list containing the versions of the API */
  versions: Array<Version>;
  /** Get a collection of webhooks for the board */
  webhooks?: Maybe<Array<Maybe<Webhook>>>;
  /** Get a collection of workspaces. */
  workspaces?: Maybe<Array<Maybe<Workspace>>>;
};


/** Get your data from monday.com */
export type QueryAssetsArgs = {
  ids: Array<InputMaybe<Scalars['Int']['input']>>;
};


/** Get your data from monday.com */
export type QueryBoardsArgs = {
  board_kind?: InputMaybe<BoardKind>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  newest_first?: InputMaybe<Scalars['Boolean']['input']>;
  order_by?: InputMaybe<BoardsOrderBy>;
  page?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<State>;
  workspace_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};


/** Get your data from monday.com */
export type QueryDocsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  object_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  order_by?: InputMaybe<DocsOrderBy>;
  page?: InputMaybe<Scalars['Int']['input']>;
  workspace_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};


/** Get your data from monday.com */
export type QueryFoldersArgs = {
  ids?: InputMaybe<Array<Scalars['Int']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  workspace_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};


/** Get your data from monday.com */
export type QueryItemsArgs = {
  exclude_nonactive?: InputMaybe<Scalars['Boolean']['input']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  newest_first?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** Get your data from monday.com */
export type QueryItems_By_Column_ValuesArgs = {
  board_id: Scalars['Int']['input'];
  column_id: Scalars['String']['input'];
  column_type?: InputMaybe<Scalars['String']['input']>;
  column_value: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<State>;
};


/** Get your data from monday.com */
export type QueryItems_By_Multiple_Column_ValuesArgs = {
  board_id: Scalars['Int']['input'];
  column_id: Scalars['String']['input'];
  column_type?: InputMaybe<Scalars['String']['input']>;
  column_values: Array<InputMaybe<Scalars['String']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<State>;
};


/** Get your data from monday.com */
export type QueryTagsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};


/** Get your data from monday.com */
export type QueryTeamsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};


/** Get your data from monday.com */
export type QueryUpdatesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** Get your data from monday.com */
export type QueryUsersArgs = {
  emails?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  kind?: InputMaybe<UserKind>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  newest_first?: InputMaybe<Scalars['Boolean']['input']>;
  non_active?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** Get your data from monday.com */
export type QueryWebhooksArgs = {
  board_id: Scalars['Int']['input'];
};


/** Get your data from monday.com */
export type QueryWorkspacesArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  kind?: InputMaybe<WorkspaceKind>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<WorkspacesOrderBy>;
  page?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<State>;
};

/** A reply for an update. */
export type Reply = {
  __typename?: 'Reply';
  /** The reply's html formatted body. */
  body: Scalars['String']['output'];
  /** The reply's creation date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The reply's creator. */
  creator?: Maybe<User>;
  /** The unique identifier of the reply creator. */
  creator_id?: Maybe<Scalars['String']['output']>;
  /** The reply's unique identifier. */
  id: Scalars['ID']['output'];
  /** The reply's text body. */
  text_body?: Maybe<Scalars['String']['output']>;
  /** The reply's last edit date. */
  updated_at?: Maybe<Scalars['Date']['output']>;
};

/** The possible states for a board or item. */
export enum State {
  /** Active only (Default). */
  ACTIVE = 'active',
  /** Active, Archived and Deleted. */
  ALL = 'all',
  /** Archived only. */
  ARCHIVED = 'archived',
  /** Deleted only. */
  DELETED = 'deleted'
}

/** A tag */
export type Tag = {
  __typename?: 'Tag';
  /** The tag's color. */
  color: Scalars['String']['output'];
  /** The tag's unique identifier. */
  id: Scalars['Int']['output'];
  /** The tag's name. */
  name: Scalars['String']['output'];
};

/** A team of users. */
export type Team = {
  __typename?: 'Team';
  /** The team's unique identifier. */
  id: Scalars['Int']['output'];
  /** The team's name. */
  name: Scalars['String']['output'];
  /** The team's picture url. */
  picture_url?: Maybe<Scalars['String']['output']>;
  /** The users in the team. */
  users?: Maybe<Array<Maybe<User>>>;
};


/** A team of users. */
export type TeamUsersArgs = {
  emails?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  kind?: InputMaybe<UserKind>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  newest_first?: InputMaybe<Scalars['Boolean']['input']>;
  non_active?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** An update. */
export type Update = {
  __typename?: 'Update';
  /** The update's assets/files. */
  assets?: Maybe<Array<Maybe<Asset>>>;
  /** The update's html formatted body. */
  body: Scalars['String']['output'];
  /** The update's creation date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The update's creator. */
  creator?: Maybe<User>;
  /** The unique identifier of the update creator. */
  creator_id?: Maybe<Scalars['String']['output']>;
  /** The update's unique identifier. */
  id: Scalars['ID']['output'];
  /** The update's item ID. */
  item_id?: Maybe<Scalars['String']['output']>;
  /** The update's replies. */
  replies?: Maybe<Array<Maybe<Reply>>>;
  /** The update's text body. */
  text_body?: Maybe<Scalars['String']['output']>;
  /** The update's last edit date. */
  updated_at?: Maybe<Scalars['Date']['output']>;
};

/** A monday.com user. */
export type User = {
  __typename?: 'User';
  /** The user's account. */
  account: Account;
  /** The user's birthday. */
  birthday?: Maybe<Scalars['Date']['output']>;
  /** The user's country code. */
  country_code?: Maybe<Scalars['String']['output']>;
  /** The user's creation date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The current user's language */
  current_language?: Maybe<Scalars['String']['output']>;
  /** The user's email. */
  email: Scalars['String']['output'];
  /** Is the user enabled or not. */
  enabled: Scalars['Boolean']['output'];
  /** The user's unique identifier. */
  id: Scalars['Int']['output'];
  /** Is the user an account admin. */
  is_admin?: Maybe<Scalars['Boolean']['output']>;
  /** Is the user a guest or not. */
  is_guest?: Maybe<Scalars['Boolean']['output']>;
  /** Is the user a pending user */
  is_pending?: Maybe<Scalars['Boolean']['output']>;
  /** Is user verified his email. */
  is_verified?: Maybe<Scalars['Boolean']['output']>;
  /** Is the user a view only user or not. */
  is_view_only?: Maybe<Scalars['Boolean']['output']>;
  /** The date the user joined the account. */
  join_date?: Maybe<Scalars['Date']['output']>;
  /** Last date & time when user was active */
  last_activity?: Maybe<Scalars['Date']['output']>;
  /** The user's location. */
  location?: Maybe<Scalars['String']['output']>;
  /** The user's mobile phone number. */
  mobile_phone?: Maybe<Scalars['String']['output']>;
  /** The user's name. */
  name: Scalars['String']['output'];
  /** The user's out of office status. */
  out_of_office?: Maybe<OutOfOffice>;
  /** The user's phone number. */
  phone?: Maybe<Scalars['String']['output']>;
  /** The user's photo in the original size. */
  photo_original?: Maybe<Scalars['String']['output']>;
  /** The user's photo in small size (150x150). */
  photo_small?: Maybe<Scalars['String']['output']>;
  /** The user's photo in thumbnail size (100x100). */
  photo_thumb?: Maybe<Scalars['String']['output']>;
  /** The user's photo in small thumbnail size (50x50). */
  photo_thumb_small?: Maybe<Scalars['String']['output']>;
  /** The user's photo in tiny size (30x30). */
  photo_tiny?: Maybe<Scalars['String']['output']>;
  /** The product to which the user signed up to first. */
  sign_up_product_kind?: Maybe<Scalars['String']['output']>;
  /** The teams the user is a member in. */
  teams?: Maybe<Array<Maybe<Team>>>;
  /** The user's timezone identifier. */
  time_zone_identifier?: Maybe<Scalars['String']['output']>;
  /** The user's title. */
  title?: Maybe<Scalars['String']['output']>;
  /** The user's profile url. */
  url: Scalars['String']['output'];
  /** The user’s utc hours difference. */
  utc_hours_diff?: Maybe<Scalars['Int']['output']>;
};


/** A monday.com user. */
export type UserTeamsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

/** The possibilities for a user kind. */
export enum UserKind {
  /** All users in account. */
  ALL = 'all',
  /** Only guests. */
  GUESTS = 'guests',
  /** Only company members. */
  NON_GUESTS = 'non_guests',
  /** All non pending members. */
  NON_PENDING = 'non_pending'
}

/** An object containing the API version details */
export type Version = {
  __typename?: 'Version';
  /** The type of the API version (deprecated / stable / preview / dev) */
  kind: VersionKind;
  /** Version string that can be used in API-Version header */
  value: Scalars['String']['output'];
};

/** All possible API version types */
export enum VersionKind {
  /** Previous stable version. Migrate to current stable as soon as possible. */
  DEPRECATED = 'deprecated',
  /** Bleeding-edge rolling version that constantly changes */
  DEV = 'dev',
  /** Next version to become stable. */
  PREVIEW = 'preview',
  /** Current version. */
  STABLE = 'stable'
}

/** Monday webhooks */
export type Webhook = {
  __typename?: 'Webhook';
  /** The webhooks's board id. */
  board_id: Scalars['Int']['output'];
  /** The webhooks's config. */
  config?: Maybe<Scalars['String']['output']>;
  /**
   * The event webhook listen to (incoming_notification / change_column_value /
   * create_column / change_status_column_value / change_subitem_column_value /
   * change_specific_column_value / create_item / create_subitem / create_update /
   * edit_update / delete_update / create_subitem_update / change_subitem_name /
   * change_name / when_date_arrived / item_deleted / subitem_deleted /
   * item_archived / subitem_archived / item_restored / item_moved_to_any_group /
   * item_moved_to_specific_group / move_subitem)
   */
  event: WebhookEventType;
  /** The webhooks's unique identifier. */
  id: Scalars['ID']['output'];
};

/** The webhook's target type. */
export enum WebhookEventType {
  /** Column value changed on board */
  CHANGE_COLUMN_VALUE = 'change_column_value',
  /** An item name changed on board */
  CHANGE_NAME = 'change_name',
  /** Specific Column value changed on board */
  CHANGE_SPECIFIC_COLUMN_VALUE = 'change_specific_column_value',
  /** Status column value changed on board */
  CHANGE_STATUS_COLUMN_VALUE = 'change_status_column_value',
  /** Column value changed on board subitem */
  CHANGE_SUBITEM_COLUMN_VALUE = 'change_subitem_column_value',
  /** An subitem name changed on board */
  CHANGE_SUBITEM_NAME = 'change_subitem_name',
  /** Column created on a board */
  CREATE_COLUMN = 'create_column',
  /** An item was created on board */
  CREATE_ITEM = 'create_item',
  /** A subitem was created on a board */
  CREATE_SUBITEM = 'create_subitem',
  /** An update was posted on board subitem */
  CREATE_SUBITEM_UPDATE = 'create_subitem_update',
  /** An update was posted on board item */
  CREATE_UPDATE = 'create_update',
  /** An update was deleted from board item */
  DELETE_UPDATE = 'delete_update',
  /** An update was edited on board item */
  EDIT_UPDATE = 'edit_update',
  /** An item was archived on a board */
  ITEM_ARCHIVED = 'item_archived',
  /** An item was deleted from a board */
  ITEM_DELETED = 'item_deleted',
  /** An item is moved to any group */
  ITEM_MOVED_TO_ANY_GROUP = 'item_moved_to_any_group',
  /** An item is moved to a specific group */
  ITEM_MOVED_TO_SPECIFIC_GROUP = 'item_moved_to_specific_group',
  /** An item restored back to board */
  ITEM_RESTORED = 'item_restored',
  /** A subitem is moved from one parent to another */
  MOVE_SUBITEM = 'move_subitem',
  /** A subitem was archived on a board */
  SUBITEM_ARCHIVED = 'subitem_archived',
  /** A subitem was deleted from a board */
  SUBITEM_DELETED = 'subitem_deleted',
  /** An item date has arrived */
  WHEN_DATE_ARRIVED = 'when_date_arrived'
}

/** A monday.com workspace. */
export type Workspace = {
  __typename?: 'Workspace';
  /** The account product that contains workspace. */
  account_product?: Maybe<AccountProduct>;
  /** The workspace's creation date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The workspace's description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The workspace's unique identifier. */
  id?: Maybe<Scalars['Int']['output']>;
  /** The workspace's kind (open / closed). */
  kind?: Maybe<WorkspaceKind>;
  /** The workspace's name. */
  name: Scalars['String']['output'];
  /** The workspace's user owners. */
  owners_subscribers?: Maybe<Array<Maybe<User>>>;
  /** The workspace's settings. */
  settings?: Maybe<WorkspaceSettings>;
  /** The workspace's state (all / active / archived / deleted). */
  state?: Maybe<State>;
  /** The workspace's team owners. */
  team_owners_subscribers?: Maybe<Array<Team>>;
  /** The teams subscribed to the workspace. */
  teams_subscribers?: Maybe<Array<Maybe<Team>>>;
  /** The users subscribed to the workspace */
  users_subscribers?: Maybe<Array<Maybe<User>>>;
};


/** A monday.com workspace. */
export type WorkspaceOwners_SubscribersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** A monday.com workspace. */
export type WorkspaceTeam_Owners_SubscribersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** A monday.com workspace. */
export type WorkspaceTeams_SubscribersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** A monday.com workspace. */
export type WorkspaceUsers_SubscribersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** The workspace's icon. */
export type WorkspaceIcon = {
  __typename?: 'WorkspaceIcon';
  /** The icon color in hex value. Used as a background for the image. */
  color?: Maybe<Scalars['String']['output']>;
  /**
   * The public image URL, which is temporary in the case of a file that was
   * uploaded by the user, so you'll need to pull a new version at least once an hour.
   *                                In case it is null, you can use the first letter of the workspace name.
   */
  image?: Maybe<Scalars['String']['output']>;
};

/** The workspace kinds available. */
export enum WorkspaceKind {
  /** Closed workspace, available to enterprise only. */
  CLOSED = 'closed',
  /** Open workspace. */
  OPEN = 'open'
}

/** The workspace's settings. */
export type WorkspaceSettings = {
  __typename?: 'WorkspaceSettings';
  /** The workspace icon. */
  icon?: Maybe<WorkspaceIcon>;
};

/** The workspace subscriber kind. */
export enum WorkspaceSubscriberKind {
  /** Workspace owner. */
  OWNER = 'owner',
  /** Workspace subscriber. */
  SUBSCRIBER = 'subscriber'
}

/** Options to order by. */
export enum WorkspacesOrderBy {
  /** The rank order of the workspace creation time (desc). */
  CREATED_AT = 'created_at'
}

export type ItemByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type ItemByIdQuery = { __typename?: 'Query', items?: Array<{ __typename?: 'Item', id: string, name: string } | null> | null };


export const ItemByIdDocument = gql`
    query itemById($id: Int!) {
  items(ids: [$id]) {
    id
    name
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    itemById(variables: ItemByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ItemByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ItemByIdQuery>(ItemByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'itemById', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;