import { type Roles } from "../types/Roles.js";
import { getRoleProperty } from "./config.js";
import { commandDescriptions } from "./strings.js";
import { type GuildMember, PermissionsBitField } from "discord.js";

const commandPermissions: Record<
  string,
  {
    permissions: bigint[];
    roles: Roles[];
  }
> = {
  config: {
    permissions: [PermissionsBitField.Flags.Administrator],
    roles: [],
  },
  embed: {
    permissions: [PermissionsBitField.Flags.ManageMessages],
    roles: [],
  },
  "experience add": {
    permissions: [],
    roles: ["admin"],
  },
  manage: {
    permissions: [],
    roles: ["admin", "moderator", "fss"],
  },
  message: {
    permissions: [PermissionsBitField.Flags.Administrator],
    roles: [],
  },
  "poll delete": {
    permissions: [PermissionsBitField.Flags.Administrator],
    roles: [],
  },
  purge: {
    permissions: [PermissionsBitField.Flags.ManageMessages],
    roles: [],
  },
  register: {
    permissions: [PermissionsBitField.Flags.Administrator],
    roles: [],
  },
  script: {
    permissions: [PermissionsBitField.Flags.Administrator],
    roles: [],
  },
  "vip add": {
    permissions: [],
    roles: ["council"],
  },
  "vip ban": {
    permissions: [],
    roles: ["council"],
  },
  "vip bans": {
    permissions: [],
    roles: ["admin", "moderator", "vip"],
  },
  "vip delete": {
    permissions: [PermissionsBitField.Flags.Administrator],
    roles: [],
  },
  "vip invite": {
    permissions: [],
    roles: ["admin", "moderator"],
  },
  "vip invited": {
    permissions: [],
    roles: ["admin", "moderator", "vip"],
  },
  "vip list": {
    permissions: [],
    roles: ["admin", "moderator", "vip"],
  },
  "vip override": {
    permissions: [PermissionsBitField.Flags.Administrator],
    roles: [],
  },
  "vip remaining": {
    permissions: [],
    roles: ["council"],
  },
  "vip remove": {
    permissions: [],
    roles: ["council"],
  },
  "vip unban": {
    permissions: [],
    roles: ["council"],
  },
  "vip upgrade": {
    permissions: [],
    roles: ["council"],
  },
};

const getCommandPermission = async (
  command: string,
): Promise<[bigint[], string[]]> => {
  const topCommand = command.split(" ")[0];

  if (Object.keys(commandPermissions).includes(command)) {
    return [
      commandPermissions[command]?.permissions ?? [],
      await Promise.all(
        commandPermissions[command]?.roles.map(
          async (role) => await getRoleProperty(role),
        ) ?? [],
      ),
    ];
  } else if (
    topCommand !== undefined &&
    Object.keys(commandPermissions).includes(topCommand)
  ) {
    return [
      commandPermissions[topCommand]?.permissions ?? [],
      await Promise.all(
        commandPermissions[topCommand]?.roles.map(
          async (role) => await getRoleProperty(role),
        ) ?? [],
      ),
    ];
  } else {
    return [[], []];
  }
};

// Check whether the member has all the command permissions, or any of the roles
export const hasCommandPermission = async (
  member: GuildMember | null,
  command: string,
) => {
  if (member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return true;
  }

  const [permissions, roles] = await getCommandPermission(command);

  if (permissions.length === 0 && roles.length === 0) {
    return true;
  }

  return (
    (permissions.length !== 0 && member?.permissions.has(permissions)) ||
    (roles.length !== 0 && member?.roles.cache.hasAny(...roles))
  );
};

export const getCommandsWithPermission = (member: GuildMember | null) => {
  return Object.keys(commandDescriptions).filter(
    async (command) => await hasCommandPermission(member, command),
  );
};
