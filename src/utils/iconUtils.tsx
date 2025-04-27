import React from 'react';
import { Item } from '../types';
import {
  Chrome,
  Code,
  FileText,
  Folder,
  Globe,
  FileIcon,
  Monitor,
  PenTool,
  Music,
  Video,
  Coffee,
  Zap
} from 'lucide-react';

export function getItemIcon(item: Item): React.ComponentType<any> {
  // Based on predefined icon name
  if (item.icon) {
    switch (item.icon.toLowerCase()) {
      case 'chrome':
        return Chrome;
      case 'code':
        return Code;
      case 'file-text':
        return FileText;
      case 'folder':
        return Folder;
      case 'globe':
        return Globe;
      case 'monitor':
        return Monitor;
      case 'pen-tool':
        return PenTool;
      case 'music':
        return Music;
      case 'video':
        return Video;
      case 'coffee':
        return Coffee;
      case 'zap':
        return Zap;
    }
  }

  // Based on item type
  switch (item.type) {
    case 'application':
      return Monitor;
    case 'document':
      return FileText;
    case 'folder':
      return Folder;
    case 'website':
      return Globe;
    default:
      return FileIcon;
  }
}