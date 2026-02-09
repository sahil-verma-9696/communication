# Functional Requirements

Assume there are 5 users register on the platform.
that are : A, B, C, D, E

## Sender View
1. user able to send friend request to any `non-friend` user except itself.
2. user able to send only `one friend request` to per user pair.
3. system shall create a new friend request with `PENDING` status.
4. sender-user unable to change the status of a friend request.

## Receiver View
1. user able to receive friend request from any `non-friend` user except itself.
2. user able to accept or reject a friend request.
3. user able to accept or reject `multiple` friend request at a time.

## Status=ACCEPTED
1. user marks a friend request as `ACCEPTED` status.
2. system shall delete the friend request after accepting it.
3. system shall create a `friendship` between the users.

## Status=REJECTED
1. user marks a friend request as `REJECTED` status.
2. system shall add `cooldown` time after rejecting a friend request for `sender` user to prevent `spamming`.
3. receiver-user can `ACCEPT` later `REJECTED` friend request.