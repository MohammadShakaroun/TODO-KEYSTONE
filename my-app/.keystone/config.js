"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");
var import_dotenv = __toESM(require("dotenv"));

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");
var lists = {
  User: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      }),
      todos: (0, import_fields.relationship)({
        ref: "Todo.author",
        many: true
      })
    }
  }),
  Todo: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      title: (0, import_fields.text)({ validation: { isRequired: true } }),
      description: (0, import_fields_document.document)({
        formatting: true,
        links: true,
        dividers: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ]
      }),
      priority: (0, import_fields.select)({
        type: "integer",
        options: [
          { label: "Low", value: 1 },
          { label: "Normal", value: 2 },
          { label: "High", value: 3 },
          { label: "Very High", value: 4 }
        ],
        defaultValue: 1,
        validation: { isRequired: true },
        ui: { displayMode: "radio" }
      }),
      author: (0, import_fields.relationship)({
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineCreate: { fields: ["name", "email"] }
        },
        access: import_access.allowAll,
        ref: "User.todos",
        many: false,
        hooks: {
          afterOperation: ({ operation, item }) => {
            if (operation === "create") {
              item.authorId = null;
            }
            if (operation === "update") {
            }
          }
        }
      })
    }
  }),
  Tag: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      Name: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      todos: (0, import_fields.relationship)({
        access: import_access.allowAll,
        ref: "Todo",
        many: true
      })
    }
  })
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  sessionData: "name createdAt",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"]
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
import_dotenv.default.config();
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      provider: "postgresql",
      url: "postgres://postgres:12345678@localhost:5432/tododb"
    },
    lists,
    session
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
