#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(
                    "sqlite:getdown.db",
                    vec![tauri_plugin_sql::Migration {
                        version: 1,
                        description: "create settings table",
                        sql: "CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)",
                        kind: tauri_plugin_sql::MigrationKind::Up,
                    }],
                )
                .build(),
        )
        .setup(|app| {
            // `pnpm dev` starts Vite first and sets TAURI_DEV_URL to the bound port.
            // The compiled config still has a default URL, so navigate at runtime.
            #[cfg(debug_assertions)]
            if let (Ok(url), Some(window)) =
                (std::env::var("TAURI_DEV_URL"), app.get_webview_window("main"))
            {
                let parsed: tauri::Url = url.parse().expect("invalid TAURI_DEV_URL");
                window.navigate(parsed)?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
