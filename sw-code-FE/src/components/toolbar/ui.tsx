import {fonts, languages} from "@/lib/constant/toolbar.values.ts";
import {themes} from "@/lib/theme/theme.ts";
import {Theme} from "@/lib/theme/theme.type.ts";
import {PageSettings} from "@/components/toolbar/page-settings.ts";
import {ToolBarItem} from "@/components/toolbar/ui.item.tsx";

interface IToolBar {
    currentTheme: Theme
    pageSettings: PageSettings
    setPageSettings: (value: PageSettings) => void;
    setCurrentTheme: (value: Theme) => void
}

export const ToolBar = (props: IToolBar) => {
    return (
        <div
            className={`flex gap-4 justify-start text-[16px] p-2 ${props.currentTheme.themeHeader.headerBackground} rounded-t-xl`}>
            <ToolBarItem
                title={'language'}
                options={languages}
                currentTheme={props.currentTheme}
                defaultValue={props.pageSettings.language}
                onChange={(v) => props.setPageSettings({
                    ...props.pageSettings,
                    language: v
                })}
            />
            <ToolBarItem
                title={'fontsize'}
                options={fonts}
                currentTheme={props.currentTheme}
                defaultValue={props.pageSettings.font}
                onChange={(v) => props.setPageSettings({
                    ...props.pageSettings,
                    font: v
                })}
            />
            <ToolBarItem
                title={'theme'}
                options={themes.map(t => ({value: t.value, label: t.label}))}
                currentTheme={props.currentTheme}
                defaultValue={props.currentTheme.value}
                onChange={(v) => props.setCurrentTheme(themes.find(t => t.value === v) || themes[0])}
            />
        </div>
    )
}