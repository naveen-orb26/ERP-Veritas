from django.core.management.base import BaseCommand

from core.backup.backup_db import run_backup


class Command(BaseCommand):

    help = "Backup database"

    def handle(self, *args, **kwargs):

        backup_file = run_backup()

        self.stdout.write(
            self.style.SUCCESS(
                f"Backup successful: {backup_file}"
            )
        )