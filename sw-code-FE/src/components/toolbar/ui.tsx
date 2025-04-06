import { fonts, languages } from '@/lib/constant/toolbar.values.ts';
import { themes } from '@/lib/theme/theme.ts';
import { ToolBarItem } from '@/components/toolbar/ui.item.tsx';
import { usePageContext } from '@/lib/hooks/useContext.ts';

export const ToolBar = () => {
  const ctx = usePageContext();
    
  return (
    <div
      className={`flex gap-4 justify-start text-[16px] p-2 ${ctx.theme.themeHeader.headerBackground} rounded-t-xl`}>
      <ToolBarItem
        title={'language'}
        options={languages}
        currentTheme={ctx.theme}
        defaultValue={ctx.pageSettings.language}
        onChange={(v) => ctx.setPageSettings({
          ...ctx.pageSettings,
          language: v
        })}
      />
      <ToolBarItem
        title={'fontsize'}
        options={fonts}
        currentTheme={ctx.theme}
        defaultValue={ctx.pageSettings.font}
        onChange={(v) => ctx.setPageSettings({
          ...ctx.pageSettings,
          font: v
        })}
      />
      <ToolBarItem
        title={'theme'}
        options={themes.map(t => ({ value: t.value, label: t.label }))}
        currentTheme={ctx.theme}
        defaultValue={ctx.theme.value}
        onChange={(v) => ctx.setTheme(themes.find(t => t.value === v) || themes[0])}
      />
    </div>
  );
};