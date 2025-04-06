import { createContext, MutableRefObject, useState } from 'react';
import { PageCtx } from '@/lib/context/page/context.model.ts';
import { themes } from '@/lib/theme/theme.ts';
import { PageSettings } from '@/components/toolbar/page-settings.ts';
import { handleFn } from '@/lib/types/handle.ts';
import { Theme } from '@/lib/theme/theme.type.ts';

const PageContext = createContext<PageCtx>(null);

export { PageContext };