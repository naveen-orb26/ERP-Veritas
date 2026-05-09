import shutil
from datetime import datetime
from pathlib import Path

from django.conf import settings


BASE_DIR = Path(settings.BASE_DIR)

DB_FILE = BASE_DIR / "db.sqlite3"

BACKUP_DIR = BASE_DIR / "backups"

BACKUP_DIR.mkdir(exist_ok=True)


def create_backup():

    if not DB_FILE.exists():
        raise Exception("Database file not found")

    timestamp = datetime.now().strftime(
        "%Y-%m-%d_%H-%M"
    )

    filename = f"db_backup_{timestamp}.sqlite3"

    destination = BACKUP_DIR / filename

    shutil.copy2(DB_FILE, destination)

    return destination


def run_backup():

    backup_file = create_backup()

    return backup_file