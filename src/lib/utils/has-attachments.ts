import { decorate } from 'ts-mixer';
import { AfterLoad, Column } from 'typeorm';
import { IAttachment } from '../types/attachment';
import { toBoolean } from '../helpers/boolean';

export abstract class HasAttachments {
  @decorate(Column({ type: 'json' }))
  attachments?: IAttachment[];

  @decorate(AfterLoad())
  parseAttachments() {
    if (!toBoolean(this.attachments)) {
      this.attachments = [];
    }
  }
}
