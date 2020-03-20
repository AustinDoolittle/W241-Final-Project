import csv
import getpass
import sys
import smtplib

import click
from tabulate import tabulate
from tqdm import tqdm

from src.database_client import DatabaseClient
from src.emailer import Emailer

def yes_or_no(question):
    reply = str(input(question + ' (y/n): ')).lower().strip()
    if reply[0] == 'y':
        return True
    if reply[0] == 'n':
        return False
    else:
        print(f'Invalid value {reply[0]}')
        return yes_or_no(question)

def _print_tabular(data):
    print(tabulate(data))


@click.group()
def cli():
    pass


@cli.command()
@click.option('--pilot', is_flag=True)
@click.option('--hostname', default='doolittle.dev')
@click.option('--sender-email', default="berkeleyw241experiment@gmail.com")
def email(pilot, hostname, sender_email):

    client = DatabaseClient()
    subject_data = client.get_subject_emails(pilot)

    print()
    print('DUMMY CHECK')
    print(f'Is Pilot?: {pilot}')
    print(f'Hostname: {hostname}')
    print(f'Number of Subjects: {len(subject_data)}')
    print()
    confirm = yes_or_no("Are you sure you would like to continue?")
    print()

    if not confirm:
        print('Exiting without doing anything')
        return

    password = getpass.getpass(f'What is the password for {sender_email}: ')

    emailer = Emailer(sender_email, password)

    print(f'Sending emails to {len(subject_data)} subjects')

    for subject_id, email_address in tqdm(subject_data):
        external_link = f'https://{hostname}?subjectID={subject_id}'
        try:
            emailer.send_email(email_address, external_link)
        except smtplib.SMTPException as e:
            print(f'Error sending email to subject {subject_id}, email {email_address}: {str(e)}')



@cli.command()
@click.option('-f', '--filename')
@click.option('--print-result', is_flag=True)
def execute(filename, print_result):
    client = DatabaseClient()

    if filename:
        print(f'Reading query from file {filename}')
        fp = open(filename, 'r')
    else:
        print('Reading query from stdin')
        fp = sys.stdin

    sql_string = fp.read()
    
    if print_result:
        _print_tabular(client._execute_sql_and_return_results(sql_string))
    else:
        client._execute_sql(sql_string)


@cli.command()
@click.argument('subject')
def get(subject):
    client = DatabaseClient()
    _print_tabular(client.get_subject_results(subject))


@cli.command()
@click.argument('filepath')
def insert(filepath):
    client = DatabaseClient()
    client.insert_subjects_from_csv(filepath)

if __name__ == '__main__':
    cli()
    