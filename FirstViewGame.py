import tkinter as tk
from tkinter import ttk

# -----------------------------
# LEVEL DEFINITIONS (STUDENTS EDIT THESE)
# -----------------------------
def level_1():
    return {
        "title": "Level 1",
        "text": (
            "You wake up in a quiet lab.\n"
            "A monitor flickers with a single message:\n\n"
            "'BEGIN.'"
        ),
        "buttons": [
            ("1 - Continue", "next"),
        ]
    }

def level_2():
    return {
        "title": "Level 2",
        "text": (
            "You enter a hallway with two doors:\n\n"
            "LEFT door: Cold air leaks out.\n"
            "RIGHT door: A low humming sound."
        ),
        "buttons": [
            ("1 - Go LEFT", "next"),
            ("2 - Go RIGHT", "next"),
        ]
    }

def level_3():
    return {
        "title": "Level 3",
        "text": (
            "A keypad blocks your way.\n\n"
            "It asks:\n"
            "What word do programmers love?\n\n"
            "(This is just flavor text. Press 1 to continue.)"
        ),
        "buttons": [
            ("1 - Continue", "next"),
        ]
    }

def level_4():
    return {
        "title": "Level 4",
        "text": (
            "Final screen.\n\n"
            "You can exit, replay, or build your own level."
        ),
        "buttons": [
            ("1 - Exit", "exit"),
            ("2 - Replay", "replay"),
            ("3 - Custom Level (add one!)", "custom"),
        ]
    }


# Put levels in order here (students add more!)
LEVELS = [level_1, level_2, level_3, level_4]


# -----------------------------
# GAME ENGINE (TEACHER CODE - STUDENTS MOSTLY DON'T TOUCH)
# -----------------------------
class TkGame:
    def __init__(self, root):
        self.root = root
        self.root.title("Tkinter Level Game")
        self.root.geometry("720x420")
        self.root.minsize(600, 360)

        self.level_index = 0

        # Layout
        self.container = ttk.Frame(root, padding=16)
        self.container.pack(fill="both", expand=True)

        self.title_label = ttk.Label(self.container, text="", font=("Segoe UI", 18, "bold"))
        self.title_label.pack(anchor="w", pady=(0, 10))

        self.text_label = ttk.Label(
            self.container,
            text="",
            font=("Segoe UI", 12),
            justify="left",
            wraplength=680
        )
        self.text_label.pack(anchor="w", fill="x")

        self.button_frame = ttk.Frame(self.container)
        self.button_frame.pack(anchor="center", pady=18)

        self.hint_label = ttk.Label(
            self.container,
            text="Tip: You can also press 1, 2, or 3 on your keyboard.",
            font=("Segoe UI", 10)
        )
        self.hint_label.pack(anchor="w", pady=(6, 0))

        # Keyboard shortcuts: press 1/2/3 triggers matching button
        self.root.bind("1", lambda e: self.press_button_by_number(1))
        self.root.bind("2", lambda e: self.press_button_by_number(2))
        self.root.bind("3", lambda e: self.press_button_by_number(3))

        self.current_buttons = []
        self.show_level()

    def clear_buttons(self):
        for w in self.button_frame.winfo_children():
            w.destroy()
        self.current_buttons = []

    def show_level(self):
        level_data = LEVELS[self.level_index]()

        self.title_label.config(text=level_data["title"])
        self.text_label.config(text=level_data["text"])

        self.clear_buttons()
        for label, action in level_data["buttons"]:
            btn = ttk.Button(self.button_frame, text=label, command=lambda a=action: self.handle_action(a))
            btn.pack(side="left", padx=8)
            self.current_buttons.append(btn)

        # Put focus on the first button so Enter works nicely
        if self.current_buttons:
            self.current_buttons[0].focus_set()

    def press_button_by_number(self, n):
        # If there are at least n buttons, click it
        if 1 <= n <= len(self.current_buttons):
            self.current_buttons[n - 1].invoke()

    def handle_action(self, action):
        if action == "next":
            self.level_index += 1
            if self.level_index >= len(LEVELS):
                self.level_index = len(LEVELS) - 1
            self.show_level()

        elif action == "replay":
            self.level_index = 0
            self.show_level()

        elif action == "exit":
            self.root.destroy()

        elif action == "custom":
            # Placeholder: if students add a custom level, route there.
            # For now, show a helpful message inside the game UI.
            self.title_label.config(text="Custom Level Not Added Yet")
            self.text_label.config(
                text=(
                    "Students: create a new level function (example below) and add it to LEVELS.\n\n"
                    "Example:\n"
                    "def level_5():\n"
                    "    return {...}\n\n"
                    "Then add it:\n"
                    "LEVELS = [level_1, level_2, level_3, level_4, level_5]\n"
                )
            )
            self.clear_buttons()
            back_btn = ttk.Button(self.button_frame, text="1 - Back to Level 4", command=self.back_to_level_4)
            back_btn.pack(side="left", padx=8)
            self.current_buttons = [back_btn]
            back_btn.focus_set()

    def back_to_level_4(self):
        self.level_index = 3
        self.show_level()


def main():
    root = tk.Tk()

    # Optional: nicer default styling
    style = ttk.Style(root)
    try:
        style.theme_use("clam")
    except tk.TclError:
        pass

    TkGame(root)
    root.mainloop()


if __name__ == "__main__":
    main()
