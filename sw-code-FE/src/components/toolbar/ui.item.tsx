import { SimpleSelect } from '@/components/ui/select/ui.tsx';
import { Theme } from '@/lib/theme/theme.type.ts';

interface IToolbarItem {
    title: string;
    options: { value: string; label: string }[];
    currentTheme: Theme;
    defaultValue?: string;
    onChange?: (value: string) => void
}

export const ToolBarItem = (props: IToolbarItem) => {
  return (
    <div className={'flex flex-col gap-1'}>
      <div className={`px-1 ${props.currentTheme.themeHeader.labelColor}`}>
        {props.title}
      </div>
      <SimpleSelect
        options={props.options}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
      />
    </div>
  );
};