// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql, relations } from "drizzle-orm";
import {
  bigint,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
  mysqlTable,
  int,
  uniqueIndex,
  decimal,
  date,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `iyoloo-web_${name}`);

//用户表
export const iUser = mysqlTable(
  "i_user",
  {
    id: int("id").primaryKey().autoincrement().notNull(),
    brand: varchar("brand", { length: 50 }).default("iyoloo"),
    clerkId: varchar("clerk_id", { length: 50 }),
    account: int("account"),
    nickname: varchar("nickname", { length: 50 }),
    firstLetter: varchar("first_letter", { length: 50 }),
    avatar: varchar("avatar", { length: 255 }),
    region: varchar("region", { length: 100 }),
    language: varchar("language", { length: 20 }),
    email: varchar("e_mail", { length: 100 }),
    password: varchar("password", { length: 100 }),
    status: int("status").default(1),
    onlineState: int("online_state").default(0),
    type: int("type").default(2),
    inviteeUserId: int("invitee_user_id").default(0),
    insertTime: timestamp("insert_time").default(sql`CURRENT_TIMESTAMP`),
    lastLoginTime: timestamp("last_login_time"),
    updateTime: timestamp("update_time").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
    isDelete: int("is_delete").default(0),
    deleteTime: timestamp("delete_time"),
    lastIp: varchar("last_ip", { length: 255 }),
    platform: int("platform"),
    ipAttribution: varchar("ip_attribution", { length: 50 }),
    isPayMsg: int("is_pay_msg").default(1),
    isBurnPayMsg: int("is_burn_pay_msg").default(1)
  },
  (table) => ({
    nicknameIdx: index("nickname_idx").on(table.nickname),
    emailIdx: index("email_idx").on(table.email),
    accountIdx: index("account_idx").on(table.account),
    typeIdx: index("type_idx").on(table.type),
  })
);

// 添加用户关系定义
export const iUserRelations = relations(iUser, ({ one,many  }) => ({
  userInfo: one(iUserInfo, {
    fields: [iUser.id],
    references: [iUserInfo.userId],
  }),
  userAccount: one(iUserAccount, {
    fields: [iUser.id],
    references: [iUserAccount.userId],
  }),
  userData: one(iUserData, {
    fields: [iUser.id],
    references: [iUserData.userId],
  }),
  // 添加新的fans关联
  fans: many(iUserFans, { 
    relationName: 'fansUser' // 作为被关注者
  }),
  following: many(iUserFans, { 
    relationName: 'user' // 作为关注者
  }),
   // 好友关系
  friends: many(iUserFriend, {
    relationName: 'user'
  }),
  friendOf: many(iUserFriend, {
    relationName: 'friendUser'
  }),
  // 好友备注
  friendNames: many(iUserFriendName, {
    relationName: 'user'
  }),
  visitors: many(iUserVisitor, {
    relationName: "user"
  }),
  visitsToOthers: many(iUserVisitor, {
    relationName: "visitor"
  }),
}));


//账户表
export const iUserAccount = mysqlTable(
  "i_user_account",
  {
    id: int("id").primaryKey().autoincrement().notNull(),
    brand: varchar("brand", { length: 50 }).default("iyoloo"),
    userId: int("user_id").references(() => iUser.id),
    goldCoin: decimal("gold_coin", { precision: 10, scale: 2 }).default("0.00"),
    character: int("character").default(0),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).default("0.00"),
    vipLevel: int("vip_level").default(0),
    vipOpen: timestamp("vip_open"),
    vipExpiration: timestamp("vip_expiration"),
    vipCharacter: int("vip_character").default(0),
    freeMsg: int("free_msg").default(0),
    freeImgMsg: int("free_img_msg").default(0),
    fictitiousGift: int("fictitious_gift").default(0),
    vagueNum: int("vague_num").default(0),
    matchCount: int("match_count").default(0),
    version: bigint("version", { mode: "number" }).default(0),
    insertTime: timestamp("insert_time").default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
    isDelete: int("is_delete").default(0),
    deleteTime: timestamp("delete_time"),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    vipLevelIdx: index("vip_level_idx").on(table.vipLevel),
  })
);
//用户信息表
export const iUserInfo = mysqlTable(
  "i_user_info",
  {
    id: int("id").primaryKey().autoincrement().notNull(),
    brand: varchar("brand", { length: 50 }).default("iyoloo"),
    userId: int("user_id").references(() => iUser.id),
    birthday: date("birthday"),
    age: int("age"),
    gender: int("gender"),
    interest: varchar("interest", { length: 255 }),
    height: decimal("height", { precision: 5, scale: 2 }),
    weight: decimal("weight", { precision: 5, scale: 2 }),
    occupation: varchar("occupation", { length: 50 }),
    personalSign: varchar("personal_sign", { length: 3000 }),
    personalSignId: varchar("personal_sign_id", { length: 255 }),
    back: varchar("back", { length: 255 }),
    insertTime: timestamp("insert_time").default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
    isDelete: int("is_delete").default(0),
    deleteTime: timestamp("delete_time"),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    genderIdx: index("gender_idx").on(table.gender),
    ageIdx: index("age_idx").on(table.age),
  })
);

//用户的统计数据
export const iUserData = mysqlTable(
  "i_user_data",
  {
    id: int("id").primaryKey().autoincrement().notNull(),
    brand: varchar("brand", { length: 50 }).default("iyoloo"),
    userId: int("user_id").references(() => iUser.id),
    visitor: int("visitor").default(0),
    fans: int("fans").default(0),
    follow: int("follow").default(0),
    friend: int("friend").default(0),
    insertTime: timestamp("insert_time").default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
    isDelete: int("is_delete").default(0),
    deleteTime: timestamp("delete_time"),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
  })
);

// 粉丝关系表
export const iUserFans = mysqlTable(
  "i_user_fans",
  {
    id: int("id").primaryKey().autoincrement().notNull(),
    brand: varchar("brand", { length: 50 }).default("iyoloo"),
    userId: int("user_id").references(() => iUser.id),
    fansUserId: int("fans_user_id").references(() => iUser.id),
    type: int("type"),  // 1关注 0取消关注
    isRead: int("is_read").default(0),  // 1已读 0未读
    insertTime: timestamp("insert_time").default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
    isDelete: int("is_delete").default(0),
    deleteTime: timestamp("delete_time"),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    fansUserIdIdx: index("fans_user_id_idx").on(table.fansUserId),
  })
);

// 添加表关系定义
export const iUserFansRelations = relations(iUserFans, ({ one }) => ({
  user: one(iUser, {
    fields: [iUserFans.userId],
    references: [iUser.id],
  }),
  fansUser: one(iUser, {
    fields: [iUserFans.fansUserId],
    references: [iUser.id],
  }),
}));

// 好友关系表
export const iUserFriend = mysqlTable(
  "i_user_friend",
  {
    id: int("id").primaryKey().autoincrement().notNull(),
    brand: varchar("brand", { length: 50 }).default("iyoloo"),
    userId: int("user_id").references(() => iUser.id),
    friendUserId: int("friend_user_id").references(() => iUser.id),
    remarkNameId: int("remark_name_id"),
    status: int("status"), // -1待审核 0待通过 1已通过 2主动解除 3被动解除 4主动拒绝 5被动拒绝
    remark: varchar("remark", { length: 500 }),
    insertTime: timestamp("insert_time").default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
    isDelete: int("is_delete").default(0),
    deleteTime: timestamp("delete_time"),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    friendUserIdIdx: index("friend_user_id_idx").on(table.friendUserId),
    statusIdx: index("status_idx").on(table.status),
  })
);

export const iUserFriendRelations = relations(iUserFriend, ({ one }) => ({
  friendUser: one(iUser, {
    fields: [iUserFriend.friendUserId],
    references: [iUser.id],
  }),
  user: one(iUser, {
    fields: [iUserFriend.userId],
    references: [iUser.id],
  }),
  remarkName: one(iUserFriendName, {
    fields: [iUserFriend.remarkNameId],
    references: [iUserFriendName.id],
  })
}));

// 好友备注表
export const iUserFriendName = mysqlTable(
  "i_user_friend_name",
  {
    id: int("id").primaryKey().autoincrement().notNull(),
    brand: varchar("brand", { length: 50 }).default("iyoloo"),
    userId: int("user_id").references(() => iUser.id),
    friendUserId: int("friend_user_id").references(() => iUser.id),
    friendRemarkName: varchar("friend_remark_name", { length: 255 }),
    insertTime: timestamp("insert_time").default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
    isDelete: int("is_delete").default(0),
    deleteTime: timestamp("delete_time"),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    friendUserIdIdx: index("friend_user_id_idx").on(table.friendUserId),
  })
);

// 好友收益表
export const iUserFriendProfit = mysqlTable(
  "i_user_friend_profit",
  {
    id: int("id").primaryKey().autoincrement().notNull(),
    brand: varchar("brand", { length: 50 }).default("iyoloo"),
    userId: int("user_id").references(() => iUser.id),
    friendUserId: int("friend_user_id").references(() => iUser.id),
    status: int("status"), // 0开启 1关闭
    profitAmount: decimal("profit_amount", { precision: 10, scale: 2 }).default("0.01"),
    insertTime: timestamp("insert_time").default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
    isDelete: int("is_delete").default(0),
    deleteTime: timestamp("delete_time"),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    friendUserIdIdx: index("friend_user_id_idx").on(table.friendUserId),
  })
);

// 访客表
export const iUserVisitor = mysqlTable(
  "i_user_visitor",
  {
    id: int("id").primaryKey().autoincrement().notNull(),
    brand: varchar("brand", { length: 50 }).default("iyoloo"),
    userId: int("user_id").references(() => iUser.id),
    visitorUserId: int("visitor_user_id").references(() => iUser.id),
    visitorNickname: varchar("visitor_nickname", { length: 50 }),
    visitorAvatar: varchar("visitor_avatar", { length: 255 }),
    isRead: int("is_read").default(0),
    date: timestamp("date"),
    insertTime: timestamp("insert_time").default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
    isDelete: int("is_delete").default(0),
    deleteTime: timestamp("delete_time"),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    visitorUserIdIdx: index("visitor_user_id_idx").on(table.visitorUserId),
    dateIdx: index("date_idx").on(table.date),
  })
);

export const iUserVisitorRelations = relations(iUserVisitor, ({ one }) => ({
  user: one(iUser, {
    fields: [iUserVisitor.userId],
    references: [iUser.id],
  }),
  visitor: one(iUser, {
    fields: [iUserVisitor.visitorUserId],
    references: [iUser.id],
  }),
}));

// 黑名单表
export const iUserBlackList = mysqlTable(
  "i_user_black_list",
  {
    id: int("id").primaryKey().autoincrement().notNull(),
    brand: varchar("brand", { length: 50 }).default("iyoloo"),
    adminId: int("admin_id"),
    userId: int("user_id").references(() => iUser.id),
    remark: varchar("remark", { length: 255 }),
    joinTime: timestamp("join_time"),
    relieveTime: timestamp("relieve_time"),
    insertTime: timestamp("insert_time").default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
    isDelete: int("is_delete").default(0),
    deleteTime: timestamp("delete_time"),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    adminIdIdx: index("admin_id_idx").on(table.adminId),
  })
);

// 相册表
export const iUserAlbum = mysqlTable(
  "i_user_album",
  {
    id: int("id").primaryKey().autoincrement().notNull(),
    brand: varchar("brand", { length: 50 }).default("iyoloo"),
    userId: int("user_id").references(() => iUser.id),
    url: varchar("url", { length: 255 }),
    top: int("top"),
    ip: varchar("ip", { length: 50 }),
    ipAttribution: varchar("ip_attribution", { length: 60 }),
    insertTime: timestamp("insert_time").default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
    isDelete: int("is_delete").default(0),
    deleteTime: timestamp("delete_time"),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
  })
);

// 互动记录表
export const iUserInteract = mysqlTable(
  "i_user_interact",
  {
    id: int("id").primaryKey().autoincrement().notNull(),
    brand: varchar("brand", { length: 50 }).default("iyoloo"),
    userId: int("user_id").references(() => iUser.id),
    type: int("type"), // 1关注 2动态评论 3动态点赞 4访问主页 5评论回复 6赠送商城礼物
    otherUserId: int("other_user_id").references(() => iUser.id),
    isRead: int("is_read").default(0),
    recordId: int("record_id"),
    remark: varchar("remark", { length: 500 }),
    insertTime: timestamp("insert_time").default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
    isDelete: int("is_delete").default(0),
    deleteTime: timestamp("delete_time"),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    otherUserIdIdx: index("other_user_id_idx").on(table.otherUserId),
    typeIdx: index("type_idx").on(table.type),
  })
);

// Add this to schema.ts where the i_user_interact table is defined
export const iUserInteractRelations = relations(iUserInteract, ({ one }) => ({
  user: one(iUser, {
    fields: [iUserInteract.userId],
    references: [iUser.id],
  }),
  otherUser: one(iUser, {
    fields: [iUserInteract.otherUserId],
    references: [iUser.id],
  }),
}));

// 用户设置表
export const iUserSet = mysqlTable(
  "i_user_set",
  {
    id: int("id").primaryKey().autoincrement().notNull(),
    brand: varchar("brand", { length: 50 }).default("iyoloo"),
    userId: int("user_id").references(() => iUser.id),
    addFriend: int("add_friend").default(1), // 1需要认证 2直接通过
    publishSupport: int("publish_support").default(1), // 1公布 0不公布
    publishComment: int("publish_comment").default(1), // 1公布 0不公布
    insertTime: timestamp("insert_time").default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
    isDelete: int("is_delete").default(0),
    deleteTime: timestamp("delete_time"),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
  })
);

// 用户咨询表
export const iUserInquiry = mysqlTable(
  "i_user_inquiry",
  {
    id: int("id").primaryKey().autoincrement().notNull(),
    brand: varchar("brand", { length: 50 }).default("iyoloo"),
    userId: int("user_id").references(() => iUser.id),
    content: varchar("content", { length: 500 }),
    reply: varchar("reply", { length: 255 }),
    status: int("status").default(0), // 0待回复 1已回复
    insertTime: timestamp("insert_time").default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
    isDelete: int("is_delete").default(0),
    deleteTime: timestamp("delete_time"),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    statusIdx: index("status_idx").on(table.status),
  })
);

// 系统年龄表
export const iSystemAge = mysqlTable('i_system_age', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  language: varchar('language', { length: 20 }),
  age: varchar('age', { length: 50 }),
  lowerLimit: int('lower_limit'),
  upperLimit: int('upper_limit'), 
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// 品牌表
export const iSystemBrand = mysqlTable('i_system_brand', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  name: varchar('name', { length: 50 }),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// 邮件模板表
export const iSystemEmailTemplate = mysqlTable('i_system_email_template', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  language: varchar('language', { length: 20 }),
  code: int('code'),
  params: varchar('params', { length: 255 }),
  htmlTxt: varchar('html_txt', { length: 10000 }),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// 身高表
export const iSystemHeight = mysqlTable('i_system_height', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  height: varchar('height', { length: 50 }),
  language: varchar('language', { length: 20 }),
  type: int('type'),
  lowerLimit: int('lower_limit'),
  upperLimit: int('upper_limit'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// 兴趣爱好表
export const iSystemHobby = mysqlTable('i_system_hobby', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  hobby: varchar('hobby', { length: 50 }),
  language: varchar('language', { length: 20 }),
  type: int('type'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// 图片审查记录表
export const iSystemImgCensor = mysqlTable('i_system_img_censor', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  url: varchar('url', { length: 300 }),
  status: int('status').default(0),
  type: int('type'),
  recordId: int('record_id'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// 语言表
export const iSystemLanguage = mysqlTable('i_system_language', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  language: varchar('language', { length: 50 }),
  code: varchar('code', { length: 20 }),
  baiduCode: varchar('baidu_code', { length: 20 }),
  chinese: varchar('chinese', { length: 20 }),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// 职业表
export const iSystemOccupation = mysqlTable('i_system_occupation', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  occupation: varchar('occupation', { length: 200 }),
  language: varchar('language', { length: 20 }),
  type: int('type'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// 地区表
export const iSystemRegion = mysqlTable('i_system_region', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  language: varchar('language', { length: 20 }),
  region: varchar('region', { length: 100 }),
  type: int('type'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// 自动回复表
export const iSystemReply = mysqlTable('i_system_reply', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  type: int('type'),
  language: varchar('language', { length: 20 }),
  content: varchar('content', { length: 500 }),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// 系统敏感词表
export const iSystemSensitive = mysqlTable('i_system_sensitive', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  type: int('type'),
  content: varchar('content', { length: 500 }),
  solveType: int('solve_type'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// 系统错误码表
export const iSystemStatusCode = mysqlTable('i_system_status_code', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  language: varchar('language', { length: 20 }),
  code: int('code'),
  msg: varchar('msg', { length: 200 }),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// VIP特权表
export const iSystemVipPrivilege = mysqlTable('i_system_vip_privilege', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  vipLevel: int('vip_level'),
  type: int('type'),
  edit: int('edit'),
  name: varchar('name', { length: 50 }),
  describe: varchar('describe', { length: 255 }),
  logic: int('logic'),
  privilege: int('privilege'),
  unit: int('unit'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// 体重表
export const iSystemWeight = mysqlTable('i_system_weight', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  weight: varchar('weight', { length: 50 }),
  language: varchar('language', { length: 20 }),
  type: int('type'),
  lowerLimit: int('lower_limit'),
  upperLimit: int('upper_limit'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});


// Mall Classification Table
export const iMallClassify = mysqlTable('i_mall_classify', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  name: varchar('name', { length: 100 }),
  product: varchar('product', { length: 255 }),
  image: varchar('image', { length: 255 }),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// Mall Goods Table
export const iMallGoods = mysqlTable('i_mall_goods', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  classifyId: int('classify_id'),
  price: decimal('price', { precision: 10, scale: 2 }),
  unit: varchar('unit', { length: 10 }),
  status: int('status'),  // 0未上架1上架
  product: varchar('product', { length: 255 }),
  image: varchar('image', { length: 255 }),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// Mall Order Table
export const iMallOrder = mysqlTable('i_mall_order', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  orderNumber: varchar('order_number', { length: 50 }),
  goodsId: int('goods_id'),
  goodsName: varchar('goods_name', { length: 50 }),
  goodsPrice: decimal('goods_price', { precision: 10, scale: 2 }),
  goodsSum: int('goods_sum'),
  buyUserId: int('buy_user_id'),
  buyNickname: varchar('buy_nickname', { length: 50 }),
  operation: int('operation'),  // 0自用1赠送
  recipientUserId: int('recipient_user_id'),
  recipientNickname: varchar('recipient_nickname', { length: 50 }),
  recipientPhone: varchar('recipient_phone', { length: 20 }),
  shippingAddress: varchar('shipping_address', { length: 200 }),
  remake: varchar('remake', { length: 255 }),
  payType: int('pay_type'),  // 1applePay 2GoolePay 3payply 4.金币
  amount: decimal('amount', { precision: 10, scale: 2 }),
  payTime: timestamp('pay_time'),
  status: int('status'),  // 0待支付 1已支付(未完成) 2已支付（已完成） 3超时未支付
  aUserId: int('a_user_id'),
  rate: decimal('rate', { precision: 10, scale: 2 }),
  commission: decimal('commission', { precision: 10, scale: 2 }),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time')
});

// Define relationships between tables
export const iMallGoodsRelations = relations(iMallGoods, ({ one }) => ({
  category: one(iMallClassify, {
    fields: [iMallGoods.classifyId],
    references: [iMallClassify.id],
  })
}));

export const iMallOrderRelations = relations(iMallOrder, ({ one }) => ({
  goods: one(iMallGoods, {
    fields: [iMallOrder.goodsId],
    references: [iMallGoods.id],
  }),
  buyer: one(iUser, {
    fields: [iMallOrder.buyUserId],
    references: [iUser.id],
  }),
  recipient: one(iUser, {
    fields: [iMallOrder.recipientUserId],
    references: [iUser.id],
  })
}));

// 商品 - 礼物选项表
export const iGoodsGift = mysqlTable('i_goods_gift', {
id: int('id').primaryKey().autoincrement(),
brand: varchar('brand', { length: 50 }).default('iyoloo'),
name: varchar('name', { length: 50 }),
icon: varchar('icon', { length: 255 }),
goldCoin: decimal('gold_coin', { precision: 10, scale: 2 }),
serial: int('serial'),
languageName: varchar('language_name', { length: 500 }),
insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
isDelete: int('is_delete').default(0),
deleteTime: timestamp('delete_time'),
});
// 商品 - 金币充值选项表
export const iGoodsGoldCoin = mysqlTable('i_goods_gold_coin', {
id: int('id').primaryKey().autoincrement(),
brand: varchar('brand', { length: 50 }).default('iyoloo'),
goldCoin: int('gold_coin'),
giveGoldCoin: int('give_gold_coin'),
amount: decimal('amount', { precision: 10, scale: 2 }),
appleProductId: varchar('apple_product_id', { length: 50 }),
insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
isDelete: int('is_delete').default(0),
deleteTime: timestamp('delete_time'),
});
// 商品 - 其他增值服务表
export const iGoodsOther = mysqlTable('i_goods_other', {
id: int('id').primaryKey().autoincrement(),
brand: varchar('brand', { length: 50 }).default('iyoloo'),
name: varchar('name', { length: 20 }),
specs: varchar('specs', { length: 100 }),
amount: decimal('amount', { precision: 10, scale: 2 }),
type: int('type'),
otherParam: varchar('other_param', { length: 255 }),
insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
isDelete: int('is_delete').default(0),
deleteTime: timestamp('delete_time'),
});
// 商品 - 翻译包充值选项表
export const iGoodsTranslate = mysqlTable('i_goods_translate', {
id: int('id').primaryKey().autoincrement(),
brand: varchar('brand', { length: 50 }).default('iyoloo'),
character: int('character'),
amount: decimal('amount', { precision: 10, scale: 2 }),
appleProductId: varchar('apple_product_id', { length: 50 }),
insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
isDelete: int('is_delete').default(0),
deleteTime: timestamp('delete_time'),
});
// 商品 - VIP充值选项表
export const iGoodsVip = mysqlTable('i_goods_vip', {
id: int('id').primaryKey().autoincrement(),
brand: varchar('brand', { length: 50 }).default('iyoloo'),
vipLevel: int('vip_level'),
month: int('month'),
amount: decimal('amount', { precision: 10, scale: 2 }),
appleProductId: varchar('apple_product_id', { length: 50 }),
insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
isDelete: int('is_delete').default(0),
deleteTime: timestamp('delete_time'),
});
// 商品 - VIP特权表
export const iGoodsVipPrivilege = mysqlTable('i_goods_vip_privilege', {
id: int('id').primaryKey(),
brand: varchar('brand', { length: 50 }).default('iyoloo'),
vipLevel: int('vip_level'),
type: int('type'),
privilege: varchar('privilege', { length: 512 }),
specs: varchar('specs', { length: 512 }),
insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
isDelete: int('is_delete').default(0),
deleteTime: timestamp('delete_time'),
});
// 支付宝交易记录表
export const iRecordAlipay = mysqlTable('i_record_alipay', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  transactionId: varchar('transaction_id', { length: 50 }),
  productId: varchar('product_id', { length: 50 }),
  type: int('type'), // 1金币充值订单 2翻译包充值订单 3vip充值订单
  orderNo: varchar('order_no', { length: 50 }),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// 苹果支付记录表
export const iRecordApplepay = mysqlTable('i_record_applepay', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  transactionId: varchar('transaction_id', { length: 50 }),
  productId: varchar('product_id', { length: 50 }),
  type: int('type'), // 1金币充值订单 2翻译包充值订单 3vip充值订单
  orderNo: varchar('order_no', { length: 50 }),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// 账单表
export const iRecordBill = mysqlTable('i_record_bill', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  userId: int('user_id').references(() => iUser.id),
  type: int('type'), // 1充值 2消费 3赠送 4会员特权 5系统添加
  typeCode: int('type_code'),
  accountChange: varchar('account_change', { length: 255 }),
  sign: int('sign'),
  remark: varchar('remark', { length: 255 }),
  recordId: int('record_id'),
  otherUserId: int('other_user_id'),
  aUserId: int('a_user_id').default(0),
  rate: decimal('rate', { precision: 5, scale: 3 }).default('0.000'),
  commission: decimal('commission', { precision: 5, scale: 2 }).default('0.00'),
  amount: decimal('amount', { precision: 10, scale: 3 }).default('0.000'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// 账单类型表
export const iRecordBillType = mysqlTable('i_record_bill_type', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  type: int('type'),
  name: varchar('name', { length: 50 }),
  serial: int('serial'),
  language: varchar('language', { length: 20 }),
  showUser: int('show_user'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// 账单类型码表
export const iRecordBillTypeCode = mysqlTable('i_record_bill_type_code', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  type: int('type'),
  typeCode: int('type_code'),
  name: varchar('name', { length: 50 }),
  serial: int('serial'),
  language: varchar('language', { length: 20 }),
  remark: varchar('remark', { length: 100 }),
  assetsType: int('assets_type'),
  showUser: int('show_user').default(1),
  billType: int('bill_type'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// 账单类型码描述表
export const iRecordBillTypeCodeDescribe = mysqlTable('i_record_bill_type_code_describe', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  typeCode: int('type_code'),
  language: varchar('language', { length: 20 }),
  accountChange: varchar('account_change', { length: 255 }),
  acParam: varchar('ac_param', { length: 100 }),
  remark: varchar('remark', { length: 255 }),
  remarkParam: varchar('remark_param', { length: 100 }),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// 动态置顶记录表
export const iRecordDynamicTop = mysqlTable('i_record_dynamic_top', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  dynamicId: int('dynamic_id'),
  status: int('status'), // 0待支付 1已支付 2已置顶 3置顶完成已到期 4中途取消
  duration: int('duration'),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  type: int('type').default(1), // 1用户置顶 2管理后台置顶
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// 礼物记录表
export const iRecordGift = mysqlTable('i_record_gift', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  orderNo: varchar('order_no', { length: 50 }),
  giveUserId: int('give_user_id').references(() => iUser.id),
  giveNickname: varchar('give_nickname', { length: 50 }),
  recipientUserId: int('recipient_user_id').references(() => iUser.id),
  recipientNickname: varchar('recipient_nickname', { length: 50 }),
  giftPrice: decimal('gift_price', { precision: 10, scale: 2 }),
  goldCoin: decimal('gold_coin', { precision: 10, scale: 2 }),
  giftNum: int('gift_num').default(0),
  name: varchar('name', { length: 200 }),
  icon: varchar('icon', { length: 255 }),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// 金币记录表
export const iRecordGoldCoin = mysqlTable('i_record_gold_coin', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  orderNo: varchar('order_no', { length: 50 }),
  buyUserId: int('buy_user_id').references(() => iUser.id),
  buyNickname: varchar('buy_nickname', { length: 50 }),
  recipientUserId: int('recipient_user_id'),
  recipientNickname: varchar('recipient_nickname', { length: 50 }),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  payType: int('pay_type'), // 1applePay 2GoolePay 3payply 4.金币 5 alipay
  status: int('status'),
  payTime: timestamp('pay_time'),
  recordId: int('record_id'),
  goldCoin: decimal('gold_coin', { precision: 10, scale: 2 }),
  aUserId: int('a_user_id').default(0),
  rate: decimal('rate', { precision: 5, scale: 3 }).default('0.000'),
  commission: decimal('commission', { precision: 5, scale: 2 }).default('0.00'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// 红包记录表
export const iRecordRedEnvelopes = mysqlTable('i_record_red_envelopes', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  orderNo: varchar('order_no', { length: 50 }),
  giveUserId: int('give_user_id').references(() => iUser.id),
  giveNickname: varchar('give_nickname', { length: 50 }),
  recipientUserId: int('recipient_user_id').references(() => iUser.id),
  recipientNickname: varchar('recipient_nickname', { length: 50 }),
  goldCoin: decimal('gold_coin', { precision: 10, scale: 2 }),
  remark: varchar('remark', { length: 255 }),
  status: int('status').default(0), // 0待领取 1已领取 2已超时退回
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// 翻译记录表
export const iRecordTranslate = mysqlTable('i_record_translate', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  orderNo: varchar('order_no', { length: 50 }),
  buyUserId: int('buy_user_id').references(() => iUser.id),
  buyNickname: varchar('buy_nickname', { length: 50 }),
  recipientUserId: int('recipient_user_id'),
  recipientNickname: varchar('recipient_nickname', { length: 50 }),
  characterNum: int('character_num'),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  payType: int('pay_type'), // 1applePay 2GoolePay 3payply 5 alipay
  status: int('status'),
  recordId: int('record_id'),
  payTime: timestamp('pay_time'),
  aUserId: int('a_user_id').default(0),
  rate: decimal('rate', { precision: 5, scale: 3 }).default('0.000'),
  commission: decimal('commission', { precision: 5, scale: 2 }).default('0.00'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// VIP记录表
export const iRecordVip = mysqlTable('i_record_vip', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  orderNo: varchar('order_no', { length: 50 }),
  buyUserId: int('buy_user_id').references(() => iUser.id),
  buyNickname: varchar('buy_nickname', { length: 50 }),
  recipientUserId: int('recipient_user_id').references(() => iUser.id),
  recipientNickname: varchar('recipient_nickname', { length: 50 }),
  recordId: int('record_id'),
  vipLevel: int('vip_level'),
  month: int('month'),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  payType: int('pay_type'), // 1applePay 2GoolePay 3payply 5 alipay
  status: int('status'),
  aUserId: int('a_user_id').default(0),
  rate: decimal('rate', { precision: 5, scale: 3 }).default('0.000'),
  commission: decimal('commission', { precision: 5, scale: 2 }).default('0.00'),
  payTime: timestamp('pay_time'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// VIP续费记录未到账表
export const iRecordVipNotReceived = mysqlTable('i_record_vip_not_received', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  userId: int('user_id'),
  vipLevel: int('vip_level'), // 1 vip 2 svip 目前本记录内只会保存 1
  days: int('days'),
  status: int('status').default(0), // 0未到账 1已到账
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// 定义表关系
export const iRecordBillRelations = relations(iRecordBill, ({ one }) => ({
  user: one(iUser, {
    fields: [iRecordBill.userId],
    references: [iUser.id],
  }),
}));

export const iRecordGiftRelations = relations(iRecordGift, ({ one }) => ({
  giver: one(iUser, {
    fields: [iRecordGift.giveUserId],
    references: [iUser.id],
  }),
  recipient: one(iUser, {
    fields: [iRecordGift.recipientUserId],
    references: [iUser.id],
  }),
}));

export const iRecordGoldCoinRelations = relations(iRecordGoldCoin, ({ one }) => ({
  buyer: one(iUser, {
    fields: [iRecordGoldCoin.buyUserId],
    references: [iUser.id],
  }),
}));

export const iRecordRedEnvelopesRelations = relations(iRecordRedEnvelopes, ({ one }) => ({
  giver: one(iUser, {
    fields: [iRecordRedEnvelopes.giveUserId],
    references: [iUser.id],
  }),
  recipient: one(iUser, {
    fields: [iRecordRedEnvelopes.recipientUserId],
    references: [iUser.id],
  }),
}));

export const iRecordTranslateRelations = relations(iRecordTranslate, ({ one }) => ({
  buyer: one(iUser, {
    fields: [iRecordTranslate.buyUserId],
    references: [iUser.id],
  }),
}));

export const iRecordVipRelations = relations(iRecordVip, ({ one }) => ({
  buyer: one(iUser, {
    fields: [iRecordVip.buyUserId],
    references: [iUser.id],
  }),
  recipient: one(iUser, {
    fields: [iRecordVip.recipientUserId],
    references: [iUser.id],
  }),
}));

export const iRecordVipNotReceivedRelations = relations(iRecordVipNotReceived, ({ one }) => ({
  user: one(iUser, {
    fields: [iRecordVipNotReceived.userId],
    references: [iUser.id],
  }),
}));

// 添加账单类型关系
export const iRecordBillTypeCodeRelations = relations(iRecordBillTypeCode, ({ many }) => ({
  describes: many(iRecordBillTypeCodeDescribe),
}));

export const iRecordBillTypeCodeDescribeRelations = relations(iRecordBillTypeCodeDescribe, ({ one }) => ({
  typeCode: one(iRecordBillTypeCode, {
    fields: [iRecordBillTypeCodeDescribe.typeCode],
    references: [iRecordBillTypeCode.typeCode],
  }),
}));

// Message audio translation table
export const iMessageAudioTranslate = mysqlTable('i_message_audio_translate', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  userId: int('user_id').default(0),
  msgId: varchar('msg_id', { length: 50 }),
  msgUrl: varchar('msg_url', { length: 255 }),
  audioDuration: varchar('audio_duration', { length: 20 }),
  message: varchar('message', { length: 3000 }),
  language: varchar('language', { length: 20 }),
  translation: varchar('translation', { length: 5000 }),
  character: int('character').default(0),
  commonCharacter: int('common_character'),
  vipCharacter: int('vip_character'),
  goldCoin: decimal('gold_coin', { precision: 10, scale: 2 }).default('0.00'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// System message table
export const iMessageSystem = mysqlTable('i_message_system', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  createAdminId: int('create_admin_id'),
  content: varchar('content', { length: 2000 }),
  url: varchar('url', { length: 255 }),
  status: int('status').default(0),
  receiveType: int('receive_type').default(0),
  language: varchar('language', { length: 255 }),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// System message user relationship table
export const iMessageSystemUser = mysqlTable('i_message_system_user', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  messageId: int('message_id').references(() => iMessageSystem.id),
  userId: int('user_id').references(() => iUser.id),
  status: int('status').default(0),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
}, (table) => ({
  messageIdIdx: index('message_id_idx').on(table.messageId),
  userIdIdx: index('user_id_idx').on(table.userId),
}));

// Message translation table
export const iMessageTranslate = mysqlTable('i_message_translate', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  userId: int('user_id'),
  message: varchar('message', { length: 3000 }),
  language: varchar('language', { length: 20 }),
  translation: varchar('translation', { length: 5000 }),
  character: int('character').default(0),
  commonCharacter: int('common_character'),
  vipCharacter: int('vip_character'),
  goldCoin: decimal('gold_coin', { precision: 10, scale: 2 }).default('0.00'),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
});

// User message table
export const iMessageUser = mysqlTable('i_message_user', {
  id: int('id').primaryKey().autoincrement(),
  brand: varchar('brand', { length: 50 }).default('iyoloo'),
  msgId: varchar('msg_id', { length: 50 }),
  fromUserId: int('from_user_id').references(() => iUser.id),
  fromNickname: varchar('from_nickname', { length: 50 }),
  fromUsername: varchar('from_username', { length: 50 }),
  toUserId: int('to_user_id').references(() => iUser.id),
  toNickname: varchar('to_nickname', { length: 50 }),
  toUsername: varchar('to_username', { length: 50 }),
  type: varchar('type', { length: 20 }),
  chatType: varchar('chat_type', { length: 20 }),
  customType: varchar('custom_type', { length: 20 }),
  content: varchar('content', { length: 2000 }).default(''),
  payload: varchar('payload', { length: 6000 }),
  translateContent: varchar('translate_content', { length: 5000 }),
  translateLanguage: varchar('translate_language', { length: 20 }),
  isRead: int('is_read').default(0),
  sendTime: bigint('send_time', { mode: 'number' }),
  callId: varchar('call_id', { length: 200 }),
  eventType: varchar('event_type', { length: 20 }),
  timestamp: bigint('timestamp', { mode: 'number' }),
  groupId: varchar('group_id', { length: 50 }),
  onlyCode: varchar('only_code', { length: 30 }),
  status: int('status').default(1),
  insertTime: timestamp('insert_time').default(sql`CURRENT_TIMESTAMP`),
  updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  isDelete: int('is_delete').default(0),
  deleteTime: timestamp('delete_time'),
  burnReadStauts: int('burn_read_stauts').default(0),
}, (table) => ({
  msgIdIdx: uniqueIndex('msg_id_idx').on(table.msgId),
  fromUserIdIdx: index('from_user_id_idx').on(table.fromUserId),
  toUserIdIdx: index('to_user_id_idx').on(table.toUserId),
  onlyCodeIdx: index('only_code_idx').on(table.onlyCode),
}));

// Define relationships
export const iMessageUserRelations = relations(iMessageUser, ({ one }) => ({
  fromUser: one(iUser, {
    fields: [iMessageUser.fromUserId],
    references: [iUser.id],
  }),
  toUser: one(iUser, {
    fields: [iMessageUser.toUserId],
    references: [iUser.id],
  }),
}));

export const iMessageSystemUserRelations = relations(iMessageSystemUser, ({ one }) => ({
  message: one(iMessageSystem, {
    fields: [iMessageSystemUser.messageId],
    references: [iMessageSystem.id],
  }),
  user: one(iUser, {
    fields: [iMessageSystemUser.userId],
    references: [iUser.id],
  }),
}));