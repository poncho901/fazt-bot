// Copyright 2020 Fazt Community ~ All rights reserved. MIT license.

import Command, { sendMessage, deleteMessage, CommandGroup } from '../command';
import { Message, Client } from 'discord.js';
import * as Settings from '../../utils/settings';

export default class SetDeveloperRole implements Command {
  names: Array<string> = ['setdevrole', 'setdeveloperrole'];
  arguments = '(rol)';
  group: CommandGroup = 'developer';
  description = 'Agrega un rol de desarrollador del bot.';

  async onCommand(message: Message, bot: Client, alias: string, params: Array<string>): Promise<void> {
    try {
      if (!message.guild || !message.member || !message.member.permissions.has('ADMINISTRATOR')) {
        return;
      }

      await message.delete();

      const roleID: string = (params[0] || '').replace('<@&', '').replace('>', '');
      if (!roleID || !roleID.length) {
        await deleteMessage(await sendMessage(message, 'debes ingresar un rol.', alias));
        return;
      }

      const role = message.guild.roles.cache.get(roleID);
      if (!role) {
        await deleteMessage(await sendMessage(message, 'el rol no existe.', alias));
        return;
      }

      if (await Settings.hasByName('developer_role')) {
        await Settings.update('developer_role', role.id);
      } else {
        await Settings.create('developer_role', role.id);
      }

      await deleteMessage(await sendMessage(message, `ahora ${role} es el rol de desarrollador del bot.`, alias));
    } catch (error) {
      console.error('Set Developer Role Command', error);
    }
  }
}
